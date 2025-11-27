using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;
using Modules.Professionals.Features.GetProfessional;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionals;

public sealed record GetProfessionalsQuery(
    string? Search,
    string? Location,
    decimal? MaxPrice,
    string? Availability,
    int Page,
    int PageSize) : IQuery<PaginationResultDto<GetProfessionalDto>>;
