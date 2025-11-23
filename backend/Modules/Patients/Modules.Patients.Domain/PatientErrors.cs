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
}
