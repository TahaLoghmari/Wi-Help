using Modules.Common.Features.Results;

namespace Modules.Professionals.Domain;

public class ProfessionalErrors
{
    public static Error AlreadyExists(Guid id) => Error.Conflict(
        "Professional.AlreadyExists",
        $"Professional already exists for this userId {id}.");
}