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

    public static Error AwardNotFound(Guid id) => Error.NotFound(
        "Award.NotFound",
        $"Award not found with id {id}.");

    public static Error EducationNotFound(Guid id) => Error.NotFound(
        "Education.NotFound",
        $"Education not found with id {id}.");

    public static Error ExperienceNotFound(Guid id) => Error.NotFound(
        "Experience.NotFound",
        $"Experience not found with id {id}.");

    public static Error ServiceNotFound(Guid id) => Error.NotFound(
        "Service.NotFound",
        $"Service not found with id {id}.");

    public static Error SpecializationNotFound(Guid id) => Error.NotFound(
        "Specialization.NotFound",
        $"Specialization not found with id {id}.");

    public static Error CountryNotFound(Guid id) => Error.NotFound(
        "Country.NotFound",
        $"Country not found with id {id}.");

    public static Error StateNotFound(Guid id) => Error.NotFound(
        "State.NotFound",
        $"State not found with id {id}.");

    public static Error Unauthorized() => Error.Unauthorized(
        "Professional.Unauthorized",
        "Professional ID claim is missing or invalid.");
}
