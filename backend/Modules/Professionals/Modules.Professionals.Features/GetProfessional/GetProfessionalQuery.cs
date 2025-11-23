using Modules.Common.Features.Abstractions;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessional;

public sealed record GetProfessionalQuery(Guid ProfessionalId) : IQuery<ProfessionalProfileDto>;
