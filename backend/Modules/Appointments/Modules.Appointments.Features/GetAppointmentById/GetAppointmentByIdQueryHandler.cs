using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Domain;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.PublicApi;

namespace Modules.Appointments.Features.GetAppointmentById;

public sealed class GetAppointmentByIdQueryHandler(
    AppointmentsDbContext dbContext,
    IPatientsModuleApi patientsApi)
    : IQueryHandler<GetAppointmentByIdQuery, GetAppointmentByIdDto>
{
    public async Task<Result<GetAppointmentByIdDto>> Handle(
        GetAppointmentByIdQuery query,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments
            .AsNoTracking()
            .FirstOrDefaultAsync(
                a => a.Id == query.AppointmentId && a.ProfessionalId == query.ProfessionalId,
                cancellationToken);

        if (appointment is null)
        {
            return Result<GetAppointmentByIdDto>.Failure(AppointmentErrors.AppointmentNotFound(query.AppointmentId));
        }

        var patientsResult = await patientsApi.GetPatientsByIdsAsync([appointment.PatientId], cancellationToken);
        if (patientsResult.IsFailure)
        {
            return Result<GetAppointmentByIdDto>.Failure(patientsResult.Error);
        }

        var patient = patientsResult.Value.Single();

        return Result<GetAppointmentByIdDto>.Success(appointment.ToDto(patient));
    }
}
