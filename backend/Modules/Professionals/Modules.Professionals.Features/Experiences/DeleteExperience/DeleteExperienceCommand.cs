using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Experiences.DeleteExperience;

public record DeleteExperienceCommand(
    Guid ProfessionalId,
    Guid ExperienceId) : ICommand;
