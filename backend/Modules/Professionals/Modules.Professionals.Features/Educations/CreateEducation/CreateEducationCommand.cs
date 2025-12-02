using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Educations.CreateEducation;

public record CreateEducationCommand(
    Guid ProfessionalId,
    string Institution,
    string Degree,
    string? FieldOfStudy,
    string? Country,
    string StartYear,
    string? EndYear,
    bool IsCurrentlyStudying) : ICommand;
