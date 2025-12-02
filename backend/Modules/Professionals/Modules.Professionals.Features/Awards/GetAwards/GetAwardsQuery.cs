using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Awards.GetAwards;

public record GetAwardsQuery(Guid ProfessionalId) : IQuery<List<AwardDto>>;
