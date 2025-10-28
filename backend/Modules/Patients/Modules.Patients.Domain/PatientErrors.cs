using Modules.Common.Features.Results;

namespace Modules.Patients.Domain;

public static class PatientErrors
{
    public static Error AlreadyExists(Guid id) => Error.Conflict(
        "Patient.AlreadyExists",
        $"Patient already exists for this userId {id}.");
    
}
