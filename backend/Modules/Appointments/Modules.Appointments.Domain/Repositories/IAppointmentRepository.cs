using Modules.Appointments.Domain.Entities;

namespace Modules.Appointments.Domain.Repositories;

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int TotalCount);

public interface IAppointmentRepository
{
    void Add(Appointment appointment);
    Task<Appointment?> GetByIdAsync(Guid appointmentId, CancellationToken cancellationToken);
    Task<Appointment?> GetForPatientAsync(Guid appointmentId, Guid patientId, CancellationToken cancellationToken);
    Task<Appointment?> GetForProfessionalAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken);
    void AddPrescription(Prescription prescription);
    Task<Prescription?> GetPrescriptionByIdAsync(Guid prescriptionId, CancellationToken cancellationToken);
    void RemovePrescription(Prescription prescription);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task<PagedResult<Appointment>> GetAdminAppointmentsPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Appointment>> GetPatientAppointmentsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Appointment>> GetProfessionalAppointmentsPageAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken);
    Task<Appointment?> GetProfessionalAppointmentAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken);
    Task<PagedResult<Prescription>> GetPatientPrescriptionsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Prescription>> GetAdminPrescriptionsPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Guid>> GetPatientProfessionalsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Guid>> GetProfessionalPatientsPageAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken);
    Task<IReadOnlyList<Appointment>> GetBookedSessionsAsync(Guid professionalId, DateTime from, DateTime to, CancellationToken cancellationToken);
}
