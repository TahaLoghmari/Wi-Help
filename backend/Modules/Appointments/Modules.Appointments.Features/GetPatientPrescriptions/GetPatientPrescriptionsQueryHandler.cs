using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.GetPatientPrescriptions;

public sealed class GetPatientPrescriptionsQueryHandler(
    AppointmentsDbContext dbContext,
    IProfessionalModuleApi professionalApi)
    : IQueryHandler<GetPatientPrescriptionsQuery, PagedResult<PrescriptionDto>>
{
    public async Task<Result<PagedResult<PrescriptionDto>>> Handle(
        GetPatientPrescriptionsQuery query,
        CancellationToken cancellationToken)
    {
        var baseQuery = dbContext.Prescriptions
            .AsNoTracking()
            .Where(p => p.PatientId == query.PatientId)
            .OrderByDescending(p => p.IssuedAt);

        var totalCount = await baseQuery.CountAsync(cancellationToken);

        var prescriptions = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        // Get professional info for prescriptions
        var professionalIds = prescriptions.Select(p => p.ProfessionalId).Distinct().ToList();
        var professionalsResult = await professionalApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);

        var professionalsMap = professionalsResult.IsSuccess 
            ? professionalsResult.Value.ToDictionary(p => p.Id)
            : new Dictionary<Guid, Modules.Professionals.PublicApi.Contracts.ProfessionalDto>();

        var dtos = prescriptions.Select(p => new PrescriptionDto
        {
            Id = p.Id,
            AppointmentId = p.AppointmentId,
            PatientId = p.PatientId,
            ProfessionalId = p.ProfessionalId,
            PdfUrl = p.PdfUrl,
            Title = p.Title,
            Notes = p.Notes,
            IssuedAt = p.IssuedAt,
            CreatedAt = p.CreatedAt,
            Professional = professionalsMap.TryGetValue(p.ProfessionalId, out var prof)
                ? new ProfessionalInfoDto
                {
                    FirstName = prof.FirstName,
                    LastName = prof.LastName,
                    ProfilePictureUrl = prof.ProfilePictureUrl,
                    Specialization = prof.Specialization
                }
                : null
        }).ToList();

        return Result<PagedResult<PrescriptionDto>>.Success(new PagedResult<PrescriptionDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        });
    }
}
