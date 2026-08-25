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

public sealed class AppointmentWorkflow(AppointmentsDbContext dbContext) : IAppointmentWorkflow
{
    public async Task<AppointmentWorkflowIntent?> PrepareProfessionalResponseAsync(
        Guid appointmentId,
        Guid professionalId,
        bool isAccepted,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

        if (appointment is null)
        {
            return null;
        }

        if (appointment.Status != AppointmentStatus.Offered)
        {
            return new AppointmentWorkflowIntent(appointment, false);
        }

        if (isAccepted)
        {
            appointment.Confirm();
        }
        else
        {
            appointment.Cancel();
        }

        return new AppointmentWorkflowIntent(appointment, true);
    }

    public Task FinalizeProfessionalResponseAsync(AppointmentWorkflowIntent intent, CancellationToken cancellationToken) =>
        dbContext.SaveChangesAsync(cancellationToken);

    public async Task<AppointmentWorkflowIntent?> PreparePatientCancellationAsync(
        Guid appointmentId,
        Guid patientId,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.PatientId == patientId,
            cancellationToken);

        if (appointment is null)
        {
            return null;
        }

        if (appointment.Status != AppointmentStatus.Offered && appointment.Status != AppointmentStatus.Confirmed)
        {
            return new AppointmentWorkflowIntent(appointment, false);
        }

        appointment.Cancel();
        return new AppointmentWorkflowIntent(appointment, true);
    }

    public Task FinalizePatientCancellationAsync(AppointmentWorkflowIntent intent, CancellationToken cancellationToken) =>
        dbContext.SaveChangesAsync(cancellationToken);

    public async Task<AppointmentWorkflowIntent?> PrepareProfessionalCancellationAsync(
        Guid appointmentId,
        Guid professionalId,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

        if (appointment is null)
        {
            return null;
        }

        if (appointment.Status != AppointmentStatus.Offered && appointment.Status != AppointmentStatus.Confirmed)
        {
            return new AppointmentWorkflowIntent(appointment, false);
        }

        appointment.Cancel();
        return new AppointmentWorkflowIntent(appointment, true);
    }

    public Task FinalizeProfessionalCancellationAsync(AppointmentWorkflowIntent intent, CancellationToken cancellationToken) =>
        dbContext.SaveChangesAsync(cancellationToken);

    public async Task<AppointmentWorkflowIntent?> PrepareProfessionalCompletionAsync(
        Guid appointmentId,
        Guid professionalId,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId && appointment.ProfessionalId == professionalId,
            cancellationToken);

        if (appointment is null)
        {
            return null;
        }

        return new AppointmentWorkflowIntent(appointment, appointment.Status == AppointmentStatus.Confirmed);
    }

    public async Task CompleteWithPrescriptionAsync(
        AppointmentWorkflowIntent intent,
        Prescription prescription,
        CancellationToken cancellationToken)
    {
        intent.Appointment.Complete();
        dbContext.Prescriptions.Add(prescription);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<Appointment?> UpdateStatusForAdminAsync(
        Guid appointmentId,
        AppointmentStatus status,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(
            appointment => appointment.Id == appointmentId,
            cancellationToken);

        if (appointment is null)
        {
            return null;
        }

        appointment.UpdateStatus(status);
        await dbContext.SaveChangesAsync(cancellationToken);
        return appointment;
    }

    public async Task<bool> DeletePrescriptionAsync(Guid prescriptionId, CancellationToken cancellationToken)
    {
        var prescription = await dbContext.Prescriptions.FirstOrDefaultAsync(
            prescription => prescription.Id == prescriptionId,
            cancellationToken);

        if (prescription is null)
        {
            return false;
        }

        dbContext.Prescriptions.Remove(prescription);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class AppointmentRead(AppointmentsDbContext dbContext) : IAppointmentRead
{
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
    public async Task<PagedResult<Prescription>> GetAdminPrescriptionsPageAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Prescriptions.CountAsync(cancellationToken);
        var prescriptions = await dbContext.Prescriptions.OrderByDescending(prescription => prescription.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Prescription>(prescriptions, totalCount);
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
}

public sealed class AppointmentScheduling(AppointmentsDbContext dbContext) : IAppointmentScheduling
{
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
