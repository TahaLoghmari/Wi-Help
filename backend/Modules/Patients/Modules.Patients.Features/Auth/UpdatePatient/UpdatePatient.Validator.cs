using FluentValidation;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public class UpdatePatientCommandValidator : AbstractValidator<UpdatePatientCommand>
{
    public UpdatePatientCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        When(x => !string.IsNullOrWhiteSpace(x.FirstName), () =>
        {
            RuleFor(x => x.FirstName)
                .MaximumLength(100)
                .WithMessage("First name cannot exceed 100 characters")
                .Matches(@"^[a-zA-Z]+$")
                .WithMessage("First name must contain only letters");
        });

        When(x => !string.IsNullOrWhiteSpace(x.LastName), () =>
        {
            RuleFor(x => x.LastName)
                .MaximumLength(100)
                .WithMessage("Last name cannot exceed 100 characters")
                .Matches(@"^[a-zA-Z]+$")
                .WithMessage("Last name must contain only letters");
        });

        When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber), () =>
        {
            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\+?[\d\s\-()]+$")
                .WithMessage("Invalid phone number format")
                .MaximumLength(20)
                .WithMessage("Phone number cannot exceed 20 characters");
        });

        When(x => x.Address != null, () =>
        {
            RuleFor(x => x.Address!.Street)
                .NotEmpty()
                .WithMessage("Street is required when address is provided")
                .MaximumLength(200)
                .WithMessage("Street cannot exceed 200 characters");

            RuleFor(x => x.Address!.City)
                .NotEmpty()
                .WithMessage("City is required when address is provided")
                .MaximumLength(100)
                .WithMessage("City cannot exceed 100 characters");

            RuleFor(x => x.Address!.State)
                .NotEmpty()
                .WithMessage("State/Province is required when address is provided")
                .MaximumLength(100)
                .WithMessage("State/Province cannot exceed 100 characters");

            RuleFor(x => x.Address!.PostalCode)
                .NotEmpty()
                .WithMessage("Postal code is required when address is provided")
                .MaximumLength(20)
                .WithMessage("Postal code cannot exceed 20 characters");

            RuleFor(x => x.Address!.Country)
                .NotEmpty()
                .WithMessage("Country is required when address is provided")
                .MaximumLength(100)
                .WithMessage("Country cannot exceed 100 characters");
        });

        When(x => x.EmergencyContact != null, () =>
        {
            RuleFor(x => x.EmergencyContact!.FullName)
                .NotEmpty()
                .WithMessage("Emergency contact full name is required when emergency contact is provided")
                .MaximumLength(100)
                .WithMessage("Emergency contact full name cannot exceed 100 characters");

            RuleFor(x => x.EmergencyContact!.PhoneNumber)
                .NotEmpty()
                .WithMessage("Emergency contact phone number is required when emergency contact is provided")
                .Matches(@"^\+?[\d\s\-()]+$")
                .WithMessage("Invalid emergency contact phone number format")
                .MaximumLength(20)
                .WithMessage("Emergency contact phone number cannot exceed 20 characters");

            RuleFor(x => x.EmergencyContact!.Relationship)
                .NotEmpty()
                .WithMessage("Relationship is required when emergency contact is provided")
                .MaximumLength(50)
                .WithMessage("Relationship cannot exceed 50 characters");
        });
    }
}
