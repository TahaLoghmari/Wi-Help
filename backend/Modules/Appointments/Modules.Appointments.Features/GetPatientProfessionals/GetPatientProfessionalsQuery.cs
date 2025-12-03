using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetPatientProfessionals;

public sealed record GetPatientProfessionalsQuery(Guid PatientId, int Page, int PageSize) : IQuery<PaginationResultDto<ProfessionalDto>>;
