using Modules.Common.Features.Abstractions;
using Modules.Common.Features.DTOs;

namespace Modules.Patients.Features.GetAllPatients;

public sealed record GetAllPatientsQuery(int Page, int PageSize) : IQuery<PaginationResultDto<GetAllPatientsDto>>;
