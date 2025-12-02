using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Experiences.GetExperiences;

public record GetExperiencesQuery(Guid ProfessionalId) : IQuery<List<ExperienceDto>>;
