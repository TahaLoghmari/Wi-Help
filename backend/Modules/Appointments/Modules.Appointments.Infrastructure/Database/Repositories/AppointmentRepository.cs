using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Domain.Repositories;

namespace Modules.Appointments.Infrastructure.Database.Repositories;

public sealed class AppointmentRepository(AppointmentsDbContext dbContext) : IAppointmentRepository
{
    public void Add(Appointment appointment) => dbContext.Appointments.Add(appointment);

    public Task<Appointment?> GetByIdAsync(Guid appointmentId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(appointment => appointment.Id == appointmentId, cancellationToken);

    public Task<Appointment?> GetForPatientAsync(Guid appointmentId, Guid patientId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.PatientId == patientId,
            cancellationToken);

    public Task<Appointment?> GetForProfessionalAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

    public void AddPrescription(Prescription prescription) => dbContext.Prescriptions.Add(prescription);

    public Task<Prescription?> GetPrescriptionByIdAsync(Guid prescriptionId, CancellationToken cancellationToken) =>
        dbContext.Prescriptions.FirstOrDefaultAsync(prescription => prescription.Id == prescriptionId, cancellationToken);

    public void RemovePrescription(Prescription prescription) => dbContext.Prescriptions.Remove(prescription);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);

    public async Task<PagedResult<Appointment>> GetAdminAppointmentsPageAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().OrderByDescending(appointment => appointment.CreatedAt);
        var totalCount = await query.CountAsync(cancellationToken);
        var appointments = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Appointment>(appointments, totalCount);
    }

    public async Task<PagedResult<Prescription>> GetPatientPrescriptionsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Prescriptions
            .AsNoTracking()
            .Where(prescription => prescription.PatientId == patientId)
            .OrderByDescending(prescription => prescription.IssuedAt);
        var totalCount = await query.CountAsync(cancellationToken);
        var prescriptions = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Prescription>(prescriptions, totalCount);
    }

    public async Task<PagedResult<Guid>> GetPatientProfessionalsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.PatientId == patientId);
        var totalCount = await query.Select(appointment => appointment.ProfessionalId).Distinct().CountAsync(cancellationToken);
        var professionalIds = totalCount == 0
            ? []
            : await query.Select(appointment => appointment.ProfessionalId).Distinct().OrderBy(id => id)
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Guid>(professionalIds, totalCount);
    }

    public async Task<PagedResult<Appointment>> GetPatientAppointmentsPageAsync(Guid patientId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.PatientId == patientId)
            .OrderByDescending(appointment => appointment.StartDate);
        var totalCount = await query.CountAsync(cancellationToken);
        var appointments = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Appointment>(appointments, totalCount);
    }

    public async Task<PagedResult<Appointment>> GetProfessionalAppointmentsPageAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.ProfessionalId == professionalId)
            .OrderByDescending(appointment => appointment.StartDate);
        var totalCount = await query.CountAsync(cancellationToken);
        var appointments = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Appointment>(appointments, totalCount);
    }

    public Task<Appointment?> GetProfessionalAppointmentAsync(Guid appointmentId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Appointments.AsNoTracking().FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

    public async Task<PagedResult<Guid>> GetProfessionalPatientsPageAsync(Guid professionalId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.Appointments.AsNoTracking().Where(appointment => appointment.ProfessionalId == professionalId);
        var totalCount = await query.Select(appointment => appointment.PatientId).Distinct().CountAsync(cancellationToken);
        var patientIds = totalCount == 0
            ? []
            : await query.Select(appointment => appointment.PatientId).Distinct().OrderBy(id => id)
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Guid>(patientIds, totalCount);
    }

    public async Task<PagedResult<Prescription>> GetAdminPrescriptionsPageAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Prescriptions.CountAsync(cancellationToken);
        var prescriptions = await dbContext.Prescriptions.OrderByDescending(prescription => prescription.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Prescription>(prescriptions, totalCount);
    }

    public async Task<IReadOnlyList<Appointment>> GetBookedSessionsAsync(
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
