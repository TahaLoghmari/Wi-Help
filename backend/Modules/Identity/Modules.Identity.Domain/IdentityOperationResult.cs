namespace Modules.Identity.Domain;

public sealed record IdentityOperationError(string Code, string Description);

public sealed record IdentityOperationResult
{
    private IdentityOperationResult(bool succeeded, IReadOnlyList<IdentityOperationError> errors)
    {
        Succeeded = succeeded;
        Errors = errors;
    }

    public bool Succeeded { get; }
    public IReadOnlyList<IdentityOperationError> Errors { get; }

    public static IdentityOperationResult Success() => new(true, Array.Empty<IdentityOperationError>());

    public static IdentityOperationResult Failure(IReadOnlyList<IdentityOperationError> errors) => new(false, errors);
}
