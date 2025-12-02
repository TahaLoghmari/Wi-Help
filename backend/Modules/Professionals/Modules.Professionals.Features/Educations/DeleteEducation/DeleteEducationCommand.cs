using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Educations.DeleteEducation;

public record DeleteEducationCommand(
    Guid ProfessionalId,
    Guid EducationId) : ICommand;
