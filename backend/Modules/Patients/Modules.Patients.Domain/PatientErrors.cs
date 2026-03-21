using Modules.Common.Features.Results;

namespace Modules.Patients.Domain;

public static class PatientErrors
{
    public static Error AlreadyExists(Guid id) => Error.Conflict(
        "Patient.AlreadyExists",
        $"Patient already exists for this userId {id}.");
    
    public static Error NotFound(Guid id) => Error.NotFound(
        "Patient.NotFound",
        $"Patient not found for userId {id}.");

    public static Error NotFoundByPatientId(Guid id) => Error.NotFound(
        "Patient.NotFound",
        $"Patient with ID {id} was not found.");

    public static Error UserNotFound() => Error.NotFound(
        "User.NotFound",
        "User not found.");

    public static Error RelationshipNotFound(Guid id) => Error.NotFound(
        "Relationship.NotFound",
        $"Relationship not found with id {id}.");

    public static Error AllergyNotFound(Guid id) => Error.NotFound(
        "Allergy.NotFound",
        $"Allergy not found with id {id}.");

    public static Error ConditionNotFound(Guid id) => Error.NotFound(
        "Condition.NotFound",
        $"Condition not found with id {id}.");

    public static Error MedicationNotFound(Guid id) => Error.NotFound(
        "Medication.NotFound",
        $"Medication not found with id {id}.");
}
