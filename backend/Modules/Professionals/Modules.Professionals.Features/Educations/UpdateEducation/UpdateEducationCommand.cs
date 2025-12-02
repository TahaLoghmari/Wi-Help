using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Educations.UpdateEducation;

public record UpdateEducationCommand(
    Guid ProfessionalId,
    Guid EducationId,
    string? Institution,
    string? Degree,
    string? FieldOfStudy,
    string? Country,
    string? StartYear,
    string? EndYear,
    bool? IsCurrentlyStudying) : ICommand;
