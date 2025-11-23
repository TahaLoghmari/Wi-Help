using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Features.DTOs;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.PublicApi;

namespace Modules.Appointments.Features.GetAppointments;

public sealed class GetAppointmentsQueryHandler(
    AppointmentsDbContext dbContext,
    IPatientsModuleApi patientsApi)
    : IQueryHandler<GetAppointmentsQuery, PagedResponse<AppointmentDto>>
{
    public async Task<Result<PagedResponse<AppointmentDto>>> Handle(
        GetAppointmentsQuery query,
        CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Appointments.CountAsync(cancellationToken);

        var appointments = await dbContext.Appointments
            .AsNoTracking()
            .OrderByDescending(a => a.StartDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        // Fetch Patient Details
        var patientIds = appointments.Select(a => a.PatientId).Distinct().ToList();
        var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        var patientsMap = patientsResult.IsSuccess 
            ? patientsResult.Value.ToDictionary(p => p.Id) 
            : [];

        var dtos = appointments.Select(a => {
            var patientName = $"Patient {a.PatientId.ToString().Substring(0, 8)}";
            string? patientAvatar = null;
            DateTime? patientDob = null;

            if (patientsMap.TryGetValue(a.PatientId, out var patient))
            {
                patientName = $"{patient.FirstName} {patient.LastName}";
                patientAvatar = patient.ProfilePictureUrl;
                if (DateTime.TryParse(patient.DateOfBirth, out var dob))
                {
                    patientDob = dob;
                }
            }

            return new AppointmentDto(
                a.Id,
                a.PatientId,
                a.ProfessionalId,
                a.Notes,
                a.StartDate,
                a.EndDate,
                a.Urgency,
                a.Status,
                a.Price,
                a.OfferedAt,
                a.ConfirmedAt,
                a.CompletedAt,
                a.CancelledAt,
                a.CreatedAt,
                a.UpdatedAt,
                patientName,
                patientAvatar,
                patientDob
            );
        }).ToList();

        return Result<PagedResponse<AppointmentDto>>.Success(new PagedResponse<AppointmentDto>(dtos, totalCount, query.Page, query.PageSize));
    }
}
