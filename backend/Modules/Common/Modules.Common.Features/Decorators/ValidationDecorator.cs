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
            // Validate the command using all registered validators
            FluentValidationFailure[] validationFailures = await ValidateAsync(command, validators, cancellationToken);

            if (validationFailures.Length == 0)
            {
                return await innerHandler.Handle(command, cancellationToken);
            }

            // If validation fails, return a failure result with the errors
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
            new(validationFailures.Select(f => new ValidationFailure(f.PropertyName, f.ErrorMessage)).ToArray());
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
            new(validationFailures.Select(f => new ValidationFailure(f.PropertyName, f.ErrorMessage)).ToArray());
    }
}