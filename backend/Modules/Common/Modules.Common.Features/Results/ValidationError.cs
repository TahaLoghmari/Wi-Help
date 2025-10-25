namespace Modules.Common.Features.Results;

public sealed record ValidationError : Error
{
    public ValidationError(ValidationFailure[] failures) 
        : base("Validation.Error", "One or more validation errors occurred.")
    {
        Failures = failures;
    }

    public ValidationFailure[] Failures { get; }
}

public sealed record ValidationFailure(string PropertyName, string ErrorMessage);

