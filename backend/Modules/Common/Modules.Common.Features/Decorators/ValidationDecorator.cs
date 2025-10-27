using FluentValidation;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using FluentValidationFailure = FluentValidation.Results.ValidationFailure;
using FluentValidationResult = FluentValidation.Results.ValidationResult;

namespace Modules.Common.Features.Decorators;

public static class ValidationDecorator
{
    public sealed class CommandHandler<TCommand, TResponse>(
        ICommandHandler<TCommand, TResponse> innerHandler,
        IEnumerable<IValidator<TCommand>> validators)
        : ICommandHandler<TCommand, TResponse>
        where TCommand : ICommand
    {
        public async Task<Result<TResponse>> Handle(TCommand command, CancellationToken cancellationToken)
        {
            FluentValidationFailure[] validationFailures = await ValidateAsync(command, validators, cancellationToken);

            if (validationFailures.Length == 0)
            {
                return await innerHandler.Handle(command, cancellationToken);
            }

            return Result<TResponse>.Failure(CreateValidationError(validationFailures));
        }

        private static async Task<FluentValidationFailure[]> ValidateAsync(
            TCommand command,
            IEnumerable<IValidator<TCommand>> validators,
            CancellationToken cancellationToken)
        {
            var validatorsList = validators.ToList();
            
            if (validatorsList.Count == 0)
            {
                return [];
            }

            var context = new ValidationContext<TCommand>(command);

            FluentValidationResult[] validationResults = await Task.WhenAll(
                validatorsList.Select(validator => validator.ValidateAsync(context, cancellationToken)));

            FluentValidationFailure[] validationFailures = validationResults
                .Where(validationResult => !validationResult.IsValid)
                .SelectMany(validationResult => validationResult.Errors)
                .ToArray();

            return validationFailures;
        }

        private static ValidationError CreateValidationError(FluentValidationFailure[] validationFailures) =>
            new(validationFailures.Select(f => new Error(f.PropertyName, f.ErrorMessage, ErrorType.Validation)).ToArray());
    }

    public sealed class CommandBaseHandler<TCommand>(
        ICommandHandler<TCommand> innerHandler,
        IEnumerable<IValidator<TCommand>> validators)
        : ICommandHandler<TCommand>
        where TCommand : ICommand
    {
        public async Task<Result> Handle(TCommand command, CancellationToken cancellationToken)
        {
            FluentValidationFailure[] validationFailures = await ValidateAsync(command, validators, cancellationToken);
            if (validationFailures.Length == 0)
            {
                return await innerHandler.Handle(command, cancellationToken);
            }
            return Result.Failure(CreateValidationError(validationFailures));
        }
        private static async Task<FluentValidationFailure[]> ValidateAsync(
            TCommand command,
            IEnumerable<IValidator<TCommand>> validators,
            CancellationToken cancellationToken)
        {
            var validatorsList = validators.ToList();
            if (validatorsList.Count == 0)
            {
                return [];
            }
            var context = new ValidationContext<TCommand>(command);
            FluentValidationResult[] validationResults = await Task.WhenAll(
                validatorsList.Select(validator => validator.ValidateAsync(context, cancellationToken)));
            FluentValidationFailure[] validationFailures = validationResults
                .Where(validationResult => !validationResult.IsValid)
                .SelectMany(validationResult => validationResult.Errors)
                .ToArray();
            return validationFailures;
        }
        private static ValidationError CreateValidationError(FluentValidationFailure[] validationFailures) =>
            new(validationFailures.Select(f => new Error(f.PropertyName, f.ErrorMessage, ErrorType.Validation)).ToArray());
    }

    public sealed class QueryHandler<TQuery, TResponse>(
        IQueryHandler<TQuery, TResponse> innerHandler,
        IEnumerable<IValidator<TQuery>> validators)
        : IQueryHandler<TQuery, TResponse>
        where TQuery : IQuery<TResponse>
    {
        public async Task<Result<TResponse>> Handle(TQuery query, CancellationToken cancellationToken)
        {
            FluentValidationFailure[] validationFailures = await ValidateAsync(query, validators, cancellationToken);

            if (validationFailures.Length == 0)
            {
                return await innerHandler.Handle(query, cancellationToken);
            }

            return Result<TResponse>.Failure(CreateValidationError(validationFailures));
        }

        private static async Task<FluentValidationFailure[]> ValidateAsync(
            TQuery query,
            IEnumerable<IValidator<TQuery>> validators,
            CancellationToken cancellationToken)
        {
            var validatorsList = validators.ToList();
            
            if (validatorsList.Count == 0)
            {
                return [];
            }

            var context = new ValidationContext<TQuery>(query);

            FluentValidationResult[] validationResults = await Task.WhenAll(
                validatorsList.Select(validator => validator.ValidateAsync(context, cancellationToken)));

            FluentValidationFailure[] validationFailures = validationResults
                .Where(validationResult => !validationResult.IsValid)
                .SelectMany(validationResult => validationResult.Errors)
                .ToArray();

            return validationFailures;
        }

        private static ValidationError CreateValidationError(FluentValidationFailure[] validationFailures) =>
            new(validationFailures.Select(f => new Error(f.PropertyName, f.ErrorMessage, ErrorType.Validation)).ToArray());
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