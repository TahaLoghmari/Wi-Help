using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using Modules.Appointments.Domain;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Domain.Repositories;
using Modules.Appointments.Features.BookAppointment;
using Modules.Appointments.Features.CancelAppointment;
using Modules.Appointments.Features.CancelAppointmentByProfessional;
using Modules.Appointments.Features.CompleteAppointment;
using Modules.Appointments.Features.RespondToAppointment;
using Modules.Appointments.Features.UpdateAppointmentStatusByAdmin;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;
using Modules.Messaging.PublicApi;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;
using NSubstitute;

namespace backend.ModuleTests;

public class AppointmentCommandTests
{
    private readonly IAppointmentRepository appointments = Substitute.For<IAppointmentRepository>();
    private readonly INotificationsModuleApi notifications = Substitute.For<INotificationsModuleApi>();
    private readonly IPatientsModuleApi patients = Substitute.For<IPatientsModuleApi>();
    private readonly IProfessionalModuleApi professionals = Substitute.For<IProfessionalModuleApi>();
    private readonly IIdentityModuleApi identity = Substitute.For<IIdentityModuleApi>();
    private readonly IMessagingModuleApi messaging = Substitute.For<IMessagingModuleApi>();
    private readonly IEmailSender email = Substitute.For<IEmailSender>();
    private readonly IFileStorage storage = Substitute.For<IFileStorage>();
    private readonly CancellationToken token = new CancellationTokenSource().Token;
    private readonly Appointment appointment = new(Guid.NewGuid(), Guid.NewGuid(),
        DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(1).AddHours(1), 100, AppointmentUrgency.Low, "Notes");

    public AppointmentCommandTests()
    {
        appointments.GetForProfessionalAsync(appointment.Id, appointment.ProfessionalId, token).Returns(appointment);
        appointments.GetForPatientAsync(appointment.Id, appointment.PatientId, token).Returns(appointment);
        appointments.GetByIdAsync(appointment.Id, token).Returns(appointment);
        var address = new Address("Street", "City", "12345", Guid.NewGuid(), Guid.NewGuid());
        patients.GetPatientsByIdsAsync(Arg.Any<IEnumerable<Guid>>(), token).Returns(
            Result<List<PatientDto>>.Success(new List<PatientDto> { new(appointment.PatientId, Guid.NewGuid(), "Pat", "Smith",
                "pat@example.com", "123", null, "2000-01-01", "Female", address, null!, null, null) }));
        professionals.GetProfessionalsByIdsAsync(Arg.Any<IEnumerable<Guid>>(), token).Returns(
            Result<List<ProfessionalDto>>.Success(new List<ProfessionalDto> { new(appointment.ProfessionalId, Guid.NewGuid(), "Doc", "Smith",
                "doc@example.com", "456", "1990-01-01", "Male", address, Guid.NewGuid(), "nurse", [], 5, 100, null, null) }));
        identity.GetUsersByRoleAsync("admin", token).Returns(Result<List<UserDto>>.Success(new List<UserDto>()));
        storage.UploadFileAsync(Arg.Any<IFormFile>(), Arg.Any<string>(), "prescriptions", token)
            .Returns("https://storage.example/prescription.pdf");
    }

    [Theory]
    [InlineData(AppointmentStatus.Confirmed)]
    [InlineData(AppointmentStatus.Completed)]
    [InlineData(AppointmentStatus.Cancelled)]
    public async Task Response_rejects_invalid_status_without_saving_or_side_effects(AppointmentStatus status)
    {
        appointment.UpdateStatus(status);
        var result = await Response().Handle(new(appointment.Id, appointment.ProfessionalId, true), token);

        result.Error.Code.Should().Be("Appointment.InvalidStatus");
        appointment.Status.Should().Be(status);
        await AssertNoSaveOrSideEffects();
        patients.ReceivedCalls().Should().BeEmpty();
    }

    [Fact]
    public async Task Response_uses_owner_scoped_lookup_and_returns_not_found_for_other_owner_or_missing_id()
    {
        var otherOwner = Guid.NewGuid();
        foreach (var id in new[] { appointment.Id, Guid.NewGuid() })
        {
            var result = await Response().Handle(new(id, otherOwner, true), token);
            result.Error.Should().Be(AppointmentErrors.AppointmentNotFound(id));
            await appointments.Received(1).GetForProfessionalAsync(id, otherOwner, token);
        }
        await appointments.DidNotReceive().GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>());
        await AssertNoSaveOrSideEffects();
    }

    [Theory]
    [InlineData(AppointmentStatus.Offered, false)]
    [InlineData(AppointmentStatus.Confirmed, false)]
    [InlineData(AppointmentStatus.Offered, true)]
    [InlineData(AppointmentStatus.Confirmed, true)]
    public async Task Cancellation_preserves_allowed_states_for_both_owners(AppointmentStatus status, bool professional)
    {
        appointment.UpdateStatus(status);
        var result = professional
            ? await ProfessionalCancellation().Handle(new(appointment.Id, appointment.ProfessionalId), token)
            : await PatientCancellation().Handle(new(appointment.Id, appointment.PatientId), token);

        result.IsSuccess.Should().BeTrue();
        appointment.Status.Should().Be(AppointmentStatus.Cancelled);
        await appointments.Received(1).SaveChangesAsync(token);
    }

    [Theory]
    [InlineData(AppointmentStatus.Completed)]
    [InlineData(AppointmentStatus.Cancelled)]
    public async Task Cancellation_rejects_terminal_states_without_saving_or_side_effects(AppointmentStatus status)
    {
        appointment.UpdateStatus(status);
        var patientResult = await PatientCancellation().Handle(new(appointment.Id, appointment.PatientId), token);
        var professionalResult = await ProfessionalCancellation().Handle(new(appointment.Id, appointment.ProfessionalId), token);

        patientResult.Error.Code.Should().Be("Appointment.InvalidStatus");
        professionalResult.Error.Code.Should().Be("Appointment.InvalidStatus");
        await AssertNoSaveOrSideEffects();
    }

    [Fact]
    public async Task Patient_cancellation_does_not_save_when_patient_lookup_fails()
    {
        var error = Error.Problem("Patient.Unavailable", "Patient lookup failed");
        patients.GetPatientsByIdsAsync(Arg.Any<IEnumerable<Guid>>(), token)
            .Returns(Result<List<PatientDto>>.Failure(error));

        var result = await PatientCancellation().Handle(new(appointment.Id, appointment.PatientId), token);

        result.Error.Should().Be(error);
        await AssertNoSaveOrSideEffects();
    }

    [Fact]
    public async Task Completion_upload_failure_does_not_mutate_or_save()
    {
        appointment.Confirm();
        var updatedAt = appointment.UpdatedAt;
        storage.UploadFileAsync(Arg.Any<IFormFile>(), Arg.Any<string>(), "prescriptions", token)
            .Returns(Task.FromException<string>(new IOException("Upload failed")));

        var result = await Completion().Handle(CompletionCommand(), token);

        result.Error.Should().Be(AppointmentErrors.PrescriptionUploadFailed());
        appointment.Status.Should().Be(AppointmentStatus.Confirmed);
        appointment.CompletedAt.Should().BeNull();
        appointment.UpdatedAt.Should().Be(updatedAt);
        appointments.DidNotReceive().AddPrescription(Arg.Any<Prescription>());
        await AssertNoSaveOrSideEffects();
    }

    [Theory]
    [InlineData(AppointmentStatus.Offered)]
    [InlineData(AppointmentStatus.Completed)]
    [InlineData(AppointmentStatus.Cancelled)]
    public async Task Completion_rejects_non_confirmed_states_without_uploading_or_saving(AppointmentStatus status)
    {
        appointment.UpdateStatus(status);

        var result = await Completion().Handle(CompletionCommand(), token);

        result.Error.Code.Should().Be("Appointment.InvalidStatus");
        appointment.Status.Should().Be(status);
        storage.ReceivedCalls().Should().BeEmpty();
        appointments.DidNotReceive().AddPrescription(Arg.Any<Prescription>());
        await AssertNoSaveOrSideEffects();
    }

    [Fact]
    public async Task Completion_stages_prescription_and_completed_appointment_in_one_save_before_notifications()
    {
        appointment.Confirm();
        Prescription? staged = null;
        appointments.When(x => x.AddPrescription(Arg.Any<Prescription>())).Do(call => staged = call.Arg<Prescription>());
        appointments.SaveChangesAsync(token).Returns(_ =>
        {
            appointment.Status.Should().Be(AppointmentStatus.Completed);
            staged.Should().NotBeNull();
            staged!.AppointmentId.Should().Be(appointment.Id);
            staged.PatientId.Should().Be(appointment.PatientId);
            staged.ProfessionalId.Should().Be(appointment.ProfessionalId);
            staged.PdfUrl.Should().Be("https://storage.example/prescription.pdf");
            return Task.CompletedTask;
        });

        var result = await Completion().Handle(CompletionCommand(), token);

        result.IsSuccess.Should().BeTrue();
        await AssertSavedBeforeNotifications();
    }

    [Fact]
    public async Task Admin_update_saves_before_notifications()
    {
        var handler = new UpdateAppointmentStatusByAdminCommandHandler(appointments,
            NullLogger<UpdateAppointmentStatusByAdminCommandHandler>.Instance, notifications, patients, professionals);

        var result = await handler.Handle(new(appointment.Id, AppointmentStatus.Confirmed), token);

        result.IsSuccess.Should().BeTrue();
        appointment.Status.Should().Be(AppointmentStatus.Confirmed);
        await AssertSavedBeforeNotifications();
    }

    [Fact]
    public async Task Booking_stages_and_saves_before_notifications_and_email()
    {
        var handler = new BookAppointmentCommandHandler(appointments, NullLogger<BookAppointmentCommandHandler>.Instance,
            notifications, professionals, patients, identity, email);

        var result = await handler.Handle(new(appointment.PatientId, appointment.ProfessionalId,
            appointment.StartDate, appointment.EndDate, 100, AppointmentUrgency.Low, "Notes"), token);

        result.IsSuccess.Should().BeTrue();
        appointments.Received(1).Add(Arg.Is<Appointment>(a => a.PatientId == appointment.PatientId && a.Status == AppointmentStatus.Offered));
        await AssertSavedBeforeNotifications("Professional");
        Received.InOrder(() =>
        {
            appointments.Add(Arg.Any<Appointment>());
            _ = appointments.SaveChangesAsync(token);
            email.EnqueueEmail(Arg.Any<Modules.Common.Features.DTOs.EmailDto>());
        });
    }

    private RespondToAppointmentCommandHandler Response() => new(appointments,
        NullLogger<RespondToAppointmentCommandHandler>.Instance, notifications, patients, professionals, messaging, identity, email);
    private CancelAppointmentCommandHandler PatientCancellation() => new(appointments,
        NullLogger<CancelAppointmentCommandHandler>.Instance, notifications, patients, professionals, identity, email);
    private CancelAppointmentByProfessionalCommandHandler ProfessionalCancellation() => new(appointments,
        NullLogger<CancelAppointmentByProfessionalCommandHandler>.Instance, notifications, patients, professionals, email);
    private CompleteAppointmentCommandHandler Completion() => new(appointments,
        NullLogger<CompleteAppointmentCommandHandler>.Instance, notifications, patients, professionals, identity, storage);
    private CompleteAppointmentCommand CompletionCommand() => new(appointment.Id, appointment.ProfessionalId,
        new FormFile(new MemoryStream([1, 2, 3]), 0, 3, "prescription", "prescription.pdf")
            { Headers = new HeaderDictionary(), ContentType = "application/pdf" }, "Title", "Notes");

    private async Task AssertNoSaveOrSideEffects()
    {
        await appointments.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
        notifications.ReceivedCalls().Should().BeEmpty();
        email.ReceivedCalls().Should().BeEmpty();
        messaging.ReceivedCalls().Should().BeEmpty();
    }

    private async Task AssertSavedBeforeNotifications(string role = "Patient")
    {
        await appointments.Received(1).SaveChangesAsync(token);
        notifications.ReceivedCalls().Should().NotBeEmpty();
        Received.InOrder(() =>
        {
            _ = appointments.SaveChangesAsync(token);
            _ = notifications.AddNotificationAsync(Arg.Any<string>(), role, Arg.Any<string>(),
                Arg.Any<string>(), Arg.Any<NotificationType>(), token);
        });
    }
}
