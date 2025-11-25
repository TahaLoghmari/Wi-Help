using Modules.Common.Features.Abstractions;
using Modules.Professionals.Features.GetProfessional;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionals;

public sealed record GetProfessionalsQuery(ProfessionalsQueryParametersDto Parameters) : IQuery<List<GetProfessionalDto>>;
