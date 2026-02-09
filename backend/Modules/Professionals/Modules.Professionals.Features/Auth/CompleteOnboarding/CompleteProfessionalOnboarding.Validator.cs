using FluentValidation;

namespace Modules.Professionals.Features.Auth.CompleteOnboarding;

internal sealed class CompleteProfessionalOnboardingValidator : AbstractValidator<CompleteProfessionalOnboardingCommand>
{
    public CompleteProfessionalOnboardingValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty()
            .WithMessage("Date of birth is required.");

        RuleFor(x => x.Gender)
            .NotEmpty()
            .WithMessage("Gender is required.")
            .MaximumLength(10)
            .WithMessage("Gender must be at most 10 characters.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("Phone number is required.")
            .MaximumLength(20)
            .WithMessage("Phone number must be at most 20 characters.");

        RuleFor(x => x.Address)
            .NotNull()
            .WithMessage("Address is required.");

        RuleFor(x => x.Address.Street)
            .NotEmpty()
            .WithMessage("Street is required.")
            .MaximumLength(100)
            .WithMessage("Street must be at most 100 characters.");

        RuleFor(x => x.Address.City)
            .NotEmpty()
            .WithMessage("City is required.")
            .MaximumLength(50)
            .WithMessage("City must be at most 50 characters.");

        RuleFor(x => x.Address.Country)
            .NotEmpty()
            .WithMessage("Country is required.")
            .MaximumLength(50)
            .WithMessage("Country must be at most 50 characters.");

        RuleFor(x => x.Address.PostalCode)
            .NotEmpty()
            .WithMessage("Postal code is required.")
            .MaximumLength(20)
            .WithMessage("Postal code must be at most 20 characters.");

        RuleFor(x => x.Address.State)
            .NotEmpty()
            .WithMessage("State is required.")
            .MaximumLength(50)
            .WithMessage("State must be at most 50 characters.");

        RuleFor(x => x.Specialization)
            .NotEmpty()
            .WithMessage("Specialization is required.")
            .MaximumLength(100)
            .WithMessage("Specialization must be at most 100 characters.");

        RuleFor(x => x.Experience)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Experience must be at least 0.");
    }
}
