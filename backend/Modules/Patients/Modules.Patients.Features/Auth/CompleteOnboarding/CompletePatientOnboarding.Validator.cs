using FluentValidation;

namespace Modules.Patients.Features.Auth.CompleteOnboarding;

internal sealed class CompletePatientOnboardingValidator : AbstractValidator<CompletePatientOnboardingCommand>
{
    public CompletePatientOnboardingValidator()
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

        RuleFor(x => x.EmergencyContact)
            .NotNull()
            .WithMessage("Emergency contact is required.");

        RuleFor(x => x.EmergencyContact.FullName)
            .NotEmpty()
            .WithMessage("Emergency contact name is required.")
            .MaximumLength(100)
            .WithMessage("Emergency contact name must be at most 100 characters.");

        RuleFor(x => x.EmergencyContact.PhoneNumber)
            .NotEmpty()
            .WithMessage("Emergency contact phone number is required.")
            .MaximumLength(20)
            .WithMessage("Emergency contact phone number must be at most 20 characters.");

        RuleFor(x => x.EmergencyContact.Relationship)
            .NotEmpty()
            .WithMessage("Relationship is required.")
            .MaximumLength(50)
            .WithMessage("Relationship must be at most 50 characters.");
    }
}
