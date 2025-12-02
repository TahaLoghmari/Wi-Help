using Modules.Common.Features.Results;

namespace Modules.Professionals.Domain;

public class ProfessionalErrors
{
    public static Error AlreadyExists(Guid id) => Error.Conflict(
        "Professional.AlreadyExists",
        $"Professional already exists for this userId {id}.");
    
    public static Error NotFound(Guid id) => Error.NotFound(
        "Professional.NotFound",
        $"Professional not found for userId {id}.");
    
    // Award errors
    public static Error AwardNotFound(Guid id) => Error.NotFound(
        "Award.NotFound",
        $"Award not found with id {id}.");
    
    // Education errors
    public static Error EducationNotFound(Guid id) => Error.NotFound(
        "Education.NotFound",
        $"Education not found with id {id}.");
    
    // Experience errors
    public static Error ExperienceNotFound(Guid id) => Error.NotFound(
        "Experience.NotFound",
        $"Experience not found with id {id}.");
}
