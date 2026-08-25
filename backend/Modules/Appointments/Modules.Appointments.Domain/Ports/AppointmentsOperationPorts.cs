using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
namespace Modules.Appointments.Domain.Ports;

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int TotalCount);
public sealed record AppointmentWorkflowIntent(Appointment Appointment, bool CanTransition);

public interface IBookAppointmentStore
{
    Task AddAsync(Appointment appointment, CancellationToken cancellationToken);
}

public interface IAppointmentWorkflow
{
    Task<AppointmentWorkflowIntent?> PrepareProfessionalResponseAsync(
        Guid appointmentId,
        Guid professionalId,
        bool isAccepted,
        CancellationToken cancellationToken);
    Task FinalizeProfessionalResponseAsync(AppointmentWorkflowIntent intent, CancellationToken cancellationToken);
    Task<AppointmentWorkflowIntent?> PreparePatientCancellationAsync(
        Guid appointmentId,
        Guid patientId,
        CancellationToken cancellationToken);
    Task FinalizePatientCancellationAsync(AppointmentWorkflowIntent intent, CancellationToken cancellationToken);
    Task<AppointmentWorkflowIntent?> PrepareProfessionalCancellationAsync(
        Guid appointmentId,
        Guid professionalId,
        CancellationToken cancellationToken);
    Task FinalizeProfessionalCancellationAsync(AppointmentWorkflowIntent intent, CancellationToken cancellationToken);
    Task<AppointmentWorkflowIntent?> PrepareProfessionalCompletionAsync(
        Guid appointmentId,
        Guid professionalId,
        CancellationToken cancellationToken);
    Task CompleteWithPrescriptionAsync(AppointmentWorkflowIntent intent, Prescription prescription, CancellationToken cancellationToken);
    Task<Appointment?> UpdateStatusForAdminAsync(Guid appointmentId, AppointmentStatus status, CancellationToken cancellationToken);
    Task<bool> DeletePrescriptionAsync(Guid prescriptionId, CancellationToken cancellationToken);
}

public interface IAppointmentRead
{
    Task<PagedResult<Appointment>> GetAdminAppointmentsPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Appointment>> GetPatientAppointmentsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Appointment>> GetProfessionalAppointmentsPageAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken);
    Task<Appointment?> GetProfessionalAppointmentAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken);
    Task<PagedResult<Prescription>> GetPatientPrescriptionsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Prescription>> GetAdminPrescriptionsPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Guid>> GetPatientProfessionalsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Guid>> GetProfessionalPatientsPageAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken);
}

public interface IAppointmentScheduling
{
    Task<IReadOnlyList<Appointment>> GetBookedSessionsAsync(
        Guid professionalId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken);
}
