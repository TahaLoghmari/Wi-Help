namespace Modules.Common.Features.Results;

public sealed record ValidationError : Error
{
    public ValidationError(Error[] errors)
        : base(
            "Validation.General",
            "One or more validation errors occurred",
            ErrorType.Validation)
    {
        Errors = errors;
    }

    public ValidationError(Error error)
        : this([error])
    {
    }

    public ValidationError(string code, string description)
        : this([Problem(code, description)])
    {
    }

    public Error[] Errors { get; }

    public static ValidationError FromResults(IEnumerable<Result> results)
    {
        return new ValidationError(results.Where(r => r.IsFailure).Select(r => r.Error).ToArray());
    }
}

