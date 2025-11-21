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
}
