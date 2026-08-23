using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Domain.Ports;

namespace Modules.Appointments.Infrastructure.Database;

public sealed class BookAppointmentStore(AppointmentsDbContext dbContext) : IBookAppointmentStore
{
    public async Task AddAsync(Appointment appointment, CancellationToken cancellationToken)
    {
        dbContext.Appointments.Add(appointment);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

public sealed class RespondToAppointmentStore(AppointmentsDbContext dbContext) : IRespondToAppointmentStore
{
    public Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}

public sealed class CancelAppointmentStore(AppointmentsDbContext dbContext) : ICancelAppointmentStore
{
    public Task<Appointment?> GetAsync(Guid appointmentId, Guid patientId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.PatientId == patientId,
            cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}

public sealed class CancelAppointmentByProfessionalStore(AppointmentsDbContext dbContext) : ICancelAppointmentByProfessionalStore
{
    public Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}

public sealed class CompleteAppointmentStore(AppointmentsDbContext dbContext) : ICompleteAppointmentStore
{
    public Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

    public Task AddPrescriptionAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        dbContext.Prescriptions.Add(prescription);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}

public sealed class UpdateAppointmentStatusByAdminStore(AppointmentsDbContext dbContext) : IUpdateAppointmentStatusByAdminStore
{
    public Task<Appointment?> GetAsync(Guid appointmentId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(appointment => appointment.Id == appointmentId, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}

public sealed class DeletePrescriptionStore(AppointmentsDbContext dbContext) : IDeletePrescriptionStore
{
    public Task<Prescription?> GetAsync(Guid prescriptionId, CancellationToken cancellationToken) =>
        dbContext.Prescriptions.FirstOrDefaultAsync(prescription => prescription.Id == prescriptionId, cancellationToken);

    public async Task DeleteAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        dbContext.Prescriptions.Remove(prescription);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

public sealed class GetAllAppointmentsForAdminStore(AppointmentsDbContext dbContext) : IGetAllAppointmentsForAdminStore
{
    public async Task<PagedResult<Appointment>> GetAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().OrderByDescending(appointment => appointment.CreatedAt);
        var totalCount = await query.CountAsync(cancellationToken);
        var appointments = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Appointment>(appointments, totalCount);
    }
}

public sealed class GetPatientPrescriptionsStore(AppointmentsDbContext dbContext) : IGetPatientPrescriptionsStore
{
    public async Task<PagedResult<Prescription>> GetAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Prescriptions
            .AsNoTracking()
            .Where(prescription => prescription.PatientId == patientId)
            .OrderByDescending(prescription => prescription.IssuedAt);
        var totalCount = await query.CountAsync(cancellationToken);
        var prescriptions = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Prescription>(prescriptions, totalCount);
    }
}

public sealed class GetPatientProfessionalsStore(AppointmentsDbContext dbContext) : IGetPatientProfessionalsStore
{
    public async Task<PagedResult<Guid>> GetAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.PatientId == patientId);
        var totalCount = await query.Select(appointment => appointment.ProfessionalId).Distinct().CountAsync(cancellationToken);
        var professionalIds = totalCount == 0
            ? []
            : await query.Select(appointment => appointment.ProfessionalId).Distinct().OrderBy(id => id)
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Guid>(professionalIds, totalCount);
    }
}

public sealed class GetAllPrescriptionsForAdminStore(AppointmentsDbContext dbContext) : IGetAllPrescriptionsForAdminStore
{
    public async Task<PagedResult<Prescription>> GetAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Prescriptions.CountAsync(cancellationToken);
        var prescriptions = await dbContext.Prescriptions.OrderByDescending(prescription => prescription.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Prescription>(prescriptions, totalCount);
    }
}

public sealed class GetPatientAppointmentsStore(AppointmentsDbContext dbContext) : IGetPatientAppointmentsStore
{
    public async Task<PagedResult<Appointment>> GetAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.PatientId == patientId)
            .OrderByDescending(appointment => appointment.StartDate);
        var totalCount = await query.CountAsync(cancellationToken);
        var appointments = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Appointment>(appointments, totalCount);
    }
}

public sealed class GetProfessionalAppointmentsStore(AppointmentsDbContext dbContext) : IGetProfessionalAppointmentsStore
{
    public async Task<PagedResult<Appointment>> GetAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.ProfessionalId == professionalId)
            .OrderByDescending(appointment => appointment.StartDate);
        var totalCount = await query.CountAsync(cancellationToken);
        var appointments = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Appointment>(appointments, totalCount);
    }
}

public sealed class GetAppointmentByIdStore(AppointmentsDbContext dbContext) : IGetAppointmentByIdStore
{
    public Task<Appointment?> GetAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Appointments.AsNoTracking().FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);
}

public sealed class GetProfessionalPatientsStore(AppointmentsDbContext dbContext) : IGetProfessionalPatientsStore
{
    public async Task<PagedResult<Guid>> GetAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.ProfessionalId == professionalId);
        var totalCount = await query.Select(appointment => appointment.PatientId).Distinct().CountAsync(cancellationToken);
        var patientIds = totalCount == 0
            ? []
            : await query.Select(appointment => appointment.PatientId).Distinct().OrderBy(id => id)
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Guid>(patientIds, totalCount);
    }
}

public sealed class GetBookedSessionsStore(AppointmentsDbContext dbContext) : IGetBookedSessionsStore
{
    public async Task<IReadOnlyList<Appointment>> GetAsync(
        Guid professionalId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken) =>
        await dbContext.Appointments.AsNoTracking()
            .Where(appointment => appointment.ProfessionalId == professionalId &&
                                  appointment.StartDate < to &&
                                  appointment.EndDate > from &&
                                  (appointment.Status == AppointmentStatus.Offered ||
                                   appointment.Status == AppointmentStatus.Confirmed))
            .ToListAsync(cancellationToken);
}
