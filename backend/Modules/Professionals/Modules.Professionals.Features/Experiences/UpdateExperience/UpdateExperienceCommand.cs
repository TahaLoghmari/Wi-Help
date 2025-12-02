using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Experiences.UpdateExperience;

public record UpdateExperienceCommand(
    Guid ProfessionalId,
    Guid ExperienceId,
    string? Title,
    string? Organization,
    string? Location,
    string? Description,
    string? StartYear,
    string? EndYear,
    bool? IsCurrentPosition) : ICommand;
