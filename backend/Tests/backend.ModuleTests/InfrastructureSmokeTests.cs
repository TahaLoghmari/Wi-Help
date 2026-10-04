using System.Data;
using FluentAssertions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Appointments.Domain.Repositories;
using Modules.Appointments.Infrastructure;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Repositories;
using Modules.Identity.Domain.Services;
using Modules.Identity.Infrastructure;
using Modules.Identity.Infrastructure.Database;
using Modules.Identity.Infrastructure.Database.Repositories;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Domain.Repositories;
using Modules.Messaging.Domain.Services;
using Modules.Messaging.Infrastructure;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Database.Repositories;
using Modules.Messaging.Infrastructure.Jobs;
using Modules.Notifications.Domain.Repositories;
using Modules.Notifications.Domain.Services;
using Modules.Notifications.Infrastructure;
using Modules.Notifications.Infrastructure.Database;
using Modules.Patients.Domain.Repositories;
using Modules.Patients.Infrastructure;
using Modules.Patients.Infrastructure.Database;
using Modules.Professionals.Domain.Repositories;
using Modules.Professionals.Infrastructure;
using Modules.Professionals.Infrastructure.Database;
using Modules.Reviews.Domain.Repositories;
using Modules.Reviews.Infrastructure;
using Modules.Reviews.Infrastructure.Database;
using NSubstitute;

namespace backend.ModuleTests;

public class InfrastructureSmokeTests
{
    // Port 1 cannot serve PostgreSQL: resolution and staging must not open a connection.
    private const string Connection = "Host=127.0.0.1;Port=1;Database=unused;Username=unused;Password=unused;Timeout=1";

    [Fact]
    public void All_module_repositories_and_domain_services_resolve_without_database_access()
    {
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            { ["ConnectionStrings:DefaultConnection"] = Connection }).Build();
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddHttpClient();
        services.AddSignalR();
        services.AddAuthentication();
        services.AddDataProtection().UseEphemeralDataProtectionProvider();
        services.AddSingleton<IConfiguration>(configuration);
        services.AddSingleton(Substitute.For<IWebHostEnvironment>());
        services.AddSingleton(Substitute.For<IEmailSender>());
        services.AddAppointmentsInfrastructure(configuration);
        services.AddIdentityInfrastructure(configuration);
        services.AddMessagingInfrastructure(configuration);
        services.AddNotificationsInfrastructure(configuration);
        services.AddPatientsInfrastructure(configuration);
        services.AddProfessionalsInfrastructure(configuration);
        services.AddReviewsInfrastructure(configuration);

        using var provider = services.BuildServiceProvider(new ServiceProviderOptions { ValidateScopes = true });
        using var scope = provider.CreateScope();
        using var secondScope = provider.CreateScope();
        Type[] repositories =
        [
            typeof(IAppointmentRepository), typeof(IIdentityLocationRepository), typeof(IRefreshTokenRepository),
            typeof(IConversationRepository), typeof(IMessageDeliveryRepository), typeof(INotificationRepository),
            typeof(IPatientRepository), typeof(IPatientCatalogRepository), typeof(IProfessionalRepository),
            typeof(IProfessionalCatalogRepository), typeof(IProfessionalQualificationsRepository),
            typeof(IProfessionalScheduleRepository), typeof(IVerificationDocumentRepository), typeof(IReviewRepository)
        ];
        foreach (var type in repositories)
        {
            var repository = scope.ServiceProvider.GetRequiredService(type);
            scope.ServiceProvider.GetRequiredService(type).Should().BeSameAs(repository);
            secondScope.ServiceProvider.GetRequiredService(type).Should().NotBeSameAs(repository);
        }

        Type[] domainServices =
        [
            typeof(IIdentityAccountService), typeof(IIdentityCredentialService), typeof(IIdentityClaimService),
            typeof(IIdentityLockoutService), typeof(ITokenManagement), typeof(IIdentityEmail), typeof(IAuthCookies),
            typeof(IGoogleAuthentication), typeof(IConversationAccessService), typeof(IMessagingRealtimeEvents),
            typeof(INotificationDelivery), typeof(MessageStatusUpdateJob)
        ];
        foreach (var type in domainServices)
            scope.ServiceProvider.GetRequiredService(type).Should().NotBeNull();

        Type[] contexts =
        [
            typeof(AppointmentsDbContext), typeof(IdentityDbContext), typeof(MessagingDbContext),
            typeof(NotificationsDbContext), typeof(PatientsDbContext), typeof(ProfessionalsDbContext), typeof(ReviewsDbContext)
        ];
        foreach (var type in contexts)
        {
            var context = (DbContext)scope.ServiceProvider.GetRequiredService(type);
            scope.ServiceProvider.GetRequiredService(type).Should().BeSameAs(context);
            var secondContext = (DbContext)secondScope.ServiceProvider.GetRequiredService(type);
            secondContext.Should().NotBeSameAs(context);
            context.Database.GetDbConnection().State.Should().Be(ConnectionState.Closed);
            secondContext.Database.GetDbConnection().State.Should().Be(ConnectionState.Closed);
        }
    }

    [Fact]
    public void Conversation_repository_add_and_add_message_only_stage_changes()
    {
        using var context = new MessagingDbContext(new DbContextOptionsBuilder<MessagingDbContext>().UseNpgsql(Connection).Options);
        var repository = new ConversationRepository(context);
        var conversation = new Conversation(Guid.NewGuid(), Guid.NewGuid(), ConversationType.ProfessionalPatient);
        var message = new Message(conversation.Id, conversation.Participant1Id, "Hello");

        repository.Add(conversation);
        repository.AddMessage(message);

        context.Entry(conversation).State.Should().Be(EntityState.Added);
        context.Entry(message).State.Should().Be(EntityState.Added);
        context.ChangeTracker.Entries().Should().HaveCount(2);
        context.Database.GetDbConnection().State.Should().Be(ConnectionState.Closed);
    }

    [Fact]
    public void Refresh_token_repository_add_and_remove_only_stage_changes()
    {
        using var context = new IdentityDbContext(new DbContextOptionsBuilder<IdentityDbContext>().UseNpgsql(Connection).Options);
        var repository = new RefreshTokenRepository(context);
        var refreshToken = new RefreshToken { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Token = "unused" };

        repository.Add(refreshToken);

        context.Entry(refreshToken).State.Should().Be(EntityState.Added);
        context.ChangeTracker.Entries().Should().ContainSingle();
        context.ChangeTracker.AcceptAllChanges();
        repository.Remove(refreshToken);

        context.Entry(refreshToken).State.Should().Be(EntityState.Deleted);
        context.Database.GetDbConnection().State.Should().Be(ConnectionState.Closed);
    }
}
