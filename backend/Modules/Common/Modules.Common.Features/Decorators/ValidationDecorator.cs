using FluentValidation;
using FluentValidation.Results;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Common.Features.Decorators;

public static class ValidationDecorator
{
    private static async Task<ValidationFailure[]> ValidateAsync<TCommand>(
        TCommand command,
        IEnumerable<IValidator<TCommand>> validators)
    {
        if (!validators.Any()) return [];

        var context = new ValidationContext<TCommand>(command);

        ValidationResult[] validationResults = await Task.WhenAll(
            validators.Select(validator => validator.ValidateAsync(context)));

        ValidationFailure[] validationFailures = validationResults
            .Where(validationResult => !validationResult.IsValid)
            .SelectMany(validationResult => validationResult.Errors)
            .ToArray();

        return validationFailures;
    }

    private static ValidationError CreateValidationError(ValidationFailure[] validationFailures)
    {
        return new ValidationError(validationFailures.Select(f => Error.Problem(f.ErrorCode, f.ErrorMessage))
            .ToArray());
    }

    public sealed class CommandHandler<TCommand, TResponse>(
        ICommandHandler<TCommand, TResponse> innerHandler,
        IEnumerable<IValidator<TCommand>> validators)
        : ICommandHandler<TCommand, TResponse>
        where TCommand : ICommand
    {
        public async Task<Result<TResponse>> Handle(TCommand command, CancellationToken cancellationToken)
        {
            var validationFailures = await ValidateAsync(command, validators);

            if (validationFailures.Length == 0) return await innerHandler.Handle(command, cancellationToken);

            return Result<TResponse>.Failure(CreateValidationError(validationFailures));
        }
    }

    public sealed class CommandBaseHandler<TCommand>(
        ICommandHandler<TCommand> innerHandler,
        IEnumerable<IValidator<TCommand>> validators)
        : ICommandHandler<TCommand>
        where TCommand : ICommand
    {
        public async Task<Result> Handle(TCommand command, CancellationToken cancellationToken)
        {
            var validationFailures = await ValidateAsync(command, validators);

            if (validationFailures.Length == 0) return await innerHandler.Handle(command, cancellationToken);

            return Result.Failure(CreateValidationError(validationFailures));
        }
    }

    public sealed class QueryHandler<TQuery, TResponse>(
        IQueryHandler<TQuery, TResponse> innerHandler,
        IEnumerable<IValidator<TQuery>> validators)
        : IQueryHandler<TQuery, TResponse>
        where TQuery : IQuery<TResponse>
    {
        public async Task<Result<TResponse>> Handle(TQuery query, CancellationToken cancellationToken)
        {
            var validationFailures = await ValidateAsync(query, validators);

            if (validationFailures.Length == 0) return await innerHandler.Handle(query, cancellationToken);

            return Result<TResponse>.Failure(CreateValidationError(validationFailures));
        }
    }
}

/*
How It Works at Runtime
Injection: When a service (e.g., an API endpoint or another handler) requests an ICommandHandler, DI provides the decorated version instead of the raw handler.
Validation Execution: The decorator's Handle method runs first:
It collects all registered IValidator<TCommand> instances for the command.
It validates the command asynchronously.
If validation fails (i.e., there are ValidationFailures), it creates a ValidationError and returns a Result.Failure without executing the inner handler.
If validation passes, it proceeds to call the inner handler.
Transparency: The original handler code doesn't need to change—validation happens seamlessly as a cross-cutting concern.
*/