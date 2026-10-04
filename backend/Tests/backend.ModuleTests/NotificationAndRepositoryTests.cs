using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Domain.Repositories;
using Modules.Appointments.Infrastructure;
using Modules.Appointments.Infrastructure.Database;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Domain.Repositories;
using Modules.Notifications.Domain.Services;
using Modules.Notifications.Features;
using Modules.Notifications.Features.MarkNotificationAsRead;
using Modules.Notifications.Features.MarkNotificationsAsRead;
using Modules.Notifications.Infrastructure.Database;
using Modules.Notifications.Infrastructure.Database.Repositories;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Domain.Repositories;
using Modules.Reviews.Infrastructure;
using Modules.Reviews.Infrastructure.Database;
using NSubstitute;
using NotificationType = Modules.Notifications.PublicApi.Contracts.NotificationType;

namespace backend.ModuleTests;

public class NotificationAndRepositoryTests
{
    // Port 1 deliberately cannot serve PostgreSQL: staging must never open a connection.
    private const string Connection = "Host=127.0.0.1;Port=1;Database=unused;Username=unused;Password=unused;Timeout=1";

    [Fact]
    public async Task Already_read_notification_succeeds_without_saving()
    {
        var repository = Substitute.For<INotificationRepository>();
        using var cancellation = new CancellationTokenSource();
        var token = cancellation.Token;
        var notification = new Notification("user", "Patient", "Title", "Message", Modules.Notifications.Domain.Enums.NotificationType.newAppointment);
        notification.MarkAsRead();
        repository.GetByIdAsync(notification.Id, "user", token).Returns(notification);
        var handler = new MarkNotificationAsReadCommandHandler(repository);

        var result = await handler.Handle(new MarkNotificationAsReadCommand(notification.Id, "user"), token);

        result.IsSuccess.Should().BeTrue();
        notification.IsRead.Should().BeTrue();
        await repository.Received(1).GetByIdAsync(notification.Id, "user", token);
        await repository.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Notification_absent_from_user_scope_fails_without_saving()
    {
        var repository = Substitute.For<INotificationRepository>();
        using var cancellation = new CancellationTokenSource();
        var token = cancellation.Token;
        var id = Guid.NewGuid();
        repository.GetByIdAsync(id, "other-user", token).Returns((Notification?)null);
        var handler = new MarkNotificationAsReadCommandHandler(repository);

        var result = await handler.Handle(new MarkNotificationAsReadCommand(id, "other-user"), token);

        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(NotificationErrors.NotFound(id));
        await repository.Received(1).GetByIdAsync(id, "other-user", token);
        await repository.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Unread_notification_is_marked_before_saving_once()
    {
        var repository = Substitute.For<INotificationRepository>();
        using var cancellation = new CancellationTokenSource();
        var token = cancellation.Token;
        var notification = new Notification("user", "Patient", "Title", "Message", Modules.Notifications.Domain.Enums.NotificationType.newAppointment);
        repository.GetByIdAsync(notification.Id, "user", token).Returns(notification);
        repository.SaveChangesAsync(token).Returns(_ =>
        {
            notification.IsRead.Should().BeTrue();
            return Task.CompletedTask;
        });
        var handler = new MarkNotificationAsReadCommandHandler(repository);

        var result = await handler.Handle(new MarkNotificationAsReadCommand(notification.Id, "user"), token);

        result.IsSuccess.Should().BeTrue();
        notification.IsRead.Should().BeTrue();
        await repository.Received(1).GetByIdAsync(notification.Id, "user", token);
        await repository.Received(1).SaveChangesAsync(token);
    }

    [Fact]
    public async Task Mark_all_with_no_unread_notifications_fails_without_saving()
    {
        var repository = Substitute.For<INotificationRepository>();
        using var cancellation = new CancellationTokenSource();
        var token = cancellation.Token;
        repository.GetUnreadAsync("user", token).Returns(Array.Empty<Notification>());
        var handler = new MarkNotificationsAsReadCommandHandler(repository);

        var result = await handler.Handle(new MarkNotificationsAsReadCommand("user"), token);

        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(NotificationErrors.NoUnread());
        await repository.Received(1).GetUnreadAsync("user", token);
        await repository.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Mark_all_marks_every_unread_notification_before_saving_once()
    {
        var repository = Substitute.For<INotificationRepository>();
        using var cancellation = new CancellationTokenSource();
        var token = cancellation.Token;
        Notification[] notifications =
        [
            new("user", "Patient", "First", "Message", Modules.Notifications.Domain.Enums.NotificationType.newAppointment),
            new("user", "Patient", "Second", "Message", Modules.Notifications.Domain.Enums.NotificationType.newAppointment)
        ];
        repository.GetUnreadAsync("user", token).Returns(notifications);
        repository.SaveChangesAsync(token).Returns(_ =>
        {
            notifications.Should().OnlyContain(notification => notification.IsRead);
            return Task.CompletedTask;
        });
        var handler = new MarkNotificationsAsReadCommandHandler(repository);

        var result = await handler.Handle(new MarkNotificationsAsReadCommand("user"), token);

        result.IsSuccess.Should().BeTrue();
        notifications.Should().OnlyContain(notification => notification.IsRead);
        await repository.Received(1).GetUnreadAsync("user", token);
        await repository.Received(1).SaveChangesAsync(token);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Notification_is_saved_before_delivery_and_save_failure_prevents_delivery(bool saveFails)
    {
        var repository = Substitute.For<INotificationRepository>();
        var delivery = Substitute.For<INotificationDelivery>();
        var token = new CancellationTokenSource().Token;
        Notification? staged = null;
        var saved = false;
        repository.When(x => x.Add(Arg.Any<Notification>())).Do(call => staged = call.Arg<Notification>());
        repository.SaveChangesAsync(token).Returns(_ =>
        {
            staged.Should().NotBeNull();
            if (saveFails) return Task.FromException(new IOException("Save failed"));
            saved = true;
            return Task.CompletedTask;
        });
        delivery.SendToUserAsync("user", Arg.Any<NotificationDto>()).Returns(call =>
        {
            saved.Should().BeTrue();
            call.Arg<NotificationDto>().Id.Should().Be(staged!.Id);
            return Task.CompletedTask;
        });
        var api = new NotificationsModuleApi(repository, delivery, NullLogger<NotificationsModuleApi>.Instance);

        Func<Task> act = () => api.AddNotificationAsync("user", "Patient", "Title", "Message", NotificationType.newAppointment, token);

        if (saveFails)
        {
            await act.Should().ThrowAsync<IOException>();
            delivery.ReceivedCalls().Should().BeEmpty();
        }
        else
        {
            await act();
            await delivery.Received(1).SendToUserAsync("user", Arg.Is<NotificationDto>(dto => dto.Title == "Title" && dto.Message == "Message"));
        }
        await repository.Received(1).SaveChangesAsync(token);
    }

    [Fact]
    public void Appointment_repository_add_and_prescription_remove_only_stage_changes()
    {
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            { ["ConnectionStrings:DefaultConnection"] = Connection }).Build();
        using var provider = new ServiceCollection().AddAppointmentsInfrastructure(configuration).BuildServiceProvider();
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppointmentsDbContext>();
        var repository = scope.ServiceProvider.GetRequiredService<IAppointmentRepository>();
        var appointment = new Appointment(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow,
            DateTime.UtcNow.AddHours(1), 100, AppointmentUrgency.Low, null);
        var prescription = new Prescription(appointment.Id, appointment.PatientId, appointment.ProfessionalId, "url");

        repository.Add(appointment);
        repository.AddPrescription(prescription);

        context.Entry(appointment).State.Should().Be(EntityState.Added);
        context.Entry(prescription).State.Should().Be(EntityState.Added);
        context.ChangeTracker.AcceptAllChanges();
        repository.RemovePrescription(prescription);
        context.Entry(prescription).State.Should().Be(EntityState.Deleted);
        context.Database.GetDbConnection().State.Should().Be(System.Data.ConnectionState.Closed);
    }

    [Fact]
    public void Review_repository_stages_review_likes_and_replies_without_database_access()
    {
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            { ["ConnectionStrings:DefaultConnection"] = Connection }).Build();
        using var provider = new ServiceCollection().AddReviewsInfrastructure(configuration).BuildServiceProvider();
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ReviewsDbContext>();
        var repository = scope.ServiceProvider.GetRequiredService<IReviewRepository>();
        var review = new Review(Guid.NewGuid(), Guid.NewGuid(), "Helpful", 5, ReviewType.ProfessionalReview);
        var like = new ReviewLike(review.Id, Guid.NewGuid());
        var reply = new ReviewReply(review.Id, Guid.NewGuid(), "Thanks");

        repository.Add(review);
        repository.AddLike(like);
        repository.AddReply(reply);

        context.Entry(review).State.Should().Be(EntityState.Added);
        context.Entry(like).State.Should().Be(EntityState.Added);
        context.Entry(reply).State.Should().Be(EntityState.Added);
        context.ChangeTracker.AcceptAllChanges();
        repository.RemoveLike(like);
        repository.RemoveReply(reply);
        context.Entry(like).State.Should().Be(EntityState.Deleted);
        context.Entry(reply).State.Should().Be(EntityState.Deleted);
        context.Database.GetDbConnection().State.Should().Be(System.Data.ConnectionState.Closed);
    }

    [Fact]
    public void Notification_repository_add_only_stages_changes()
    {
        using var context = new NotificationsDbContext(new DbContextOptionsBuilder<NotificationsDbContext>().UseNpgsql(Connection).Options);
        var repository = new NotificationRepository(context);
        var notification = new Notification("user", "Patient", "Title", "Message", Modules.Notifications.Domain.Enums.NotificationType.newAppointment);

        repository.Add(notification);

        context.Entry(notification).State.Should().Be(EntityState.Added);
        context.ChangeTracker.Entries().Should().ContainSingle();
        context.Database.GetDbConnection().State.Should().Be(System.Data.ConnectionState.Closed);
    }
}
