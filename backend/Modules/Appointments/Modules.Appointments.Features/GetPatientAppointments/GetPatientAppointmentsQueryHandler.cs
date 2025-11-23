using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Features.DTOs;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.GetPatientAppointments;

public sealed class GetPatientAppointmentsQueryHandler(
    AppointmentsDbContext dbContext,
    IProfessionalModuleApi professionalApi)
    : IQueryHandler<GetPatientAppointmentsQuery, PagedResponse<AppointmentDto>>
{
    public async Task<Result<PagedResponse<AppointmentDto>>> Handle(
        GetPatientAppointmentsQuery query,
        CancellationToken cancellationToken)
    {
        var baseQuery = dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.PatientId == query.PatientId);

        var totalCount = await baseQuery.CountAsync(cancellationToken);

        var appointments = await baseQuery
            .OrderByDescending(a => a.StartDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        var professionalIds = appointments.Select(a => a.ProfessionalId).Distinct().ToList();
        var professionalsResult = await professionalApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);
        var professionalsMap = professionalsResult.IsSuccess 
            ? professionalsResult.Value.ToDictionary(p => p.Id) 
            : [];

        var dtos = appointments.Select(a => {
            var professionalName = $"Professional {a.ProfessionalId.ToString().Substring(0, 8)}";
            string? professionalAvatar = null;

            if (professionalsMap.TryGetValue(a.ProfessionalId, out var professional))
            {
                professionalName = $"{professional.FirstName} {professional.LastName}";
                professionalAvatar = professional.ProfilePictureUrl;
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
                professionalName, 
                professionalAvatar, 
                null 
            );
        }).ToList();

        return Result<PagedResponse<AppointmentDto>>.Success(new PagedResponse<AppointmentDto>(dtos, totalCount, query.Page, query.PageSize));
    }
}
