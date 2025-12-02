using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Experiences.CreateExperience;

public record CreateExperienceCommand(
    Guid ProfessionalId,
    string Title,
    string Organization,
    string? Location,
    string? Description,
    string StartYear,
    string? EndYear,
    bool IsCurrentPosition) : ICommand;
