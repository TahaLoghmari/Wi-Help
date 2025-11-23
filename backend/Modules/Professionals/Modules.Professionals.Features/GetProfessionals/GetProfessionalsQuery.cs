using Modules.Common.Features.Abstractions;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionals;

public sealed record GetProfessionalsQuery : IQuery<List<ProfessionalProfileDto>>;
