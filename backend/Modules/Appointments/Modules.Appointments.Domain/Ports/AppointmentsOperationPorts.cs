using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;

namespace Modules.Appointments.Domain.Ports;

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int TotalCount);

public interface IBookAppointmentStore
{
    Task AddAsync(Appointment appointment, CancellationToken cancellationToken);
}

public interface IRespondToAppointmentStore
{
    Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface ICancelAppointmentStore
{
    Task<Appointment?> GetAsync(Guid appointmentId, Guid patientId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface ICancelAppointmentByProfessionalStore
{
    Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface ICompleteAppointmentStore
{
    Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken);
    Task AddPrescriptionAsync(Prescription prescription, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface IUpdateAppointmentStatusByAdminStore
{
    Task<Appointment?> GetAsync(Guid appointmentId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface IDeletePrescriptionStore
{
    Task<Prescription?> GetAsync(Guid prescriptionId, CancellationToken cancellationToken);
    Task DeleteAsync(Prescription prescription, CancellationToken cancellationToken);
}

public interface IGetAllAppointmentsForAdminStore
{
    Task<PagedResult<Appointment>> GetAsync(int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetPatientPrescriptionsStore
{
    Task<PagedResult<Prescription>> GetAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetPatientProfessionalsStore
{
    Task<PagedResult<Guid>> GetAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetAllPrescriptionsForAdminStore
{
    Task<PagedResult<Prescription>> GetAsync(int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetPatientAppointmentsStore
{
    Task<PagedResult<Appointment>> GetAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetProfessionalAppointmentsStore
{
    Task<PagedResult<Appointment>> GetAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetAppointmentByIdStore
{
    Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken);
}

public interface IGetProfessionalPatientsStore
{
    Task<PagedResult<Guid>> GetAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetBookedSessionsStore
{
    Task<IReadOnlyList<Appointment>> GetAsync(
        Guid professionalId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken);
}
