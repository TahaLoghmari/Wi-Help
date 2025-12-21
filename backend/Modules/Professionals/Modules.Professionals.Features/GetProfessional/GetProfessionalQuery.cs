using Modules.Common.Features.Abstractions;
using Modules.Professionals.Features.GetProfessionals;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessional;

public sealed record GetProfessionalQuery(
    Guid ProfessionalId,
    double? RequesterLatitude = null,
    double? RequesterLongitude = null) : IQuery<GetProfessionalDto>;
