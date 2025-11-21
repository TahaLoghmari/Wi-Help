using FluentValidation;

namespace Modules.Patients.Features.Auth.RegisterPatient;

public class RegisterPatientCommandValidator : AbstractValidator<RegisterPatientCommand>
{
    public RegisterPatientCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Invalid email format")
            .MaximumLength(256);

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required")
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 characters")
            .Matches(@"[A-Z]")
            .WithMessage("Password must contain at least one uppercase letter")
            .Matches(@"[a-z]")
            .WithMessage("Password must contain at least one lowercase letter")
            .Matches(@"[0-9]")
            .WithMessage("Password must contain at least one digit")
            .Matches(@"[\W_]")
            .WithMessage("Password must contain at least one special character");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Passwords do not match");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First name is required")
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last name is required")
            .MaximumLength(100);

        RuleFor(x => x.DateOfBirth)
            .NotEmpty()
            .WithMessage("Date of birth is required")
            .Must(BeAValidDate)
            .WithMessage("Invalid date format");

        RuleFor(x => x.Gender)
            .NotEmpty()
            .WithMessage("Gender is required")
            .Must(g => new[] { "Male", "Female", "Other" }.Contains(g, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Gender must be Male, Female, or Other");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("Phone number is required")
            .Matches(@"^\+?[\d\s\-()]+$")
            .WithMessage("Invalid phone number format")
            .MaximumLength(20);

        RuleFor(x => x.Address.Street)
            .NotEmpty()
            .WithMessage("Street is required")
            .MaximumLength(200);

        RuleFor(x => x.Address.City)
            .NotEmpty()
            .WithMessage("City is required")
            .MaximumLength(100);

        RuleFor(x => x.Address.State)
            .NotEmpty()
            .WithMessage("State/Province is required")
            .MaximumLength(100);

        RuleFor(x => x.Address.PostalCode)
            .NotEmpty()
            .WithMessage("Postal code is required")
            .MaximumLength(20);

        RuleFor(x => x.Address.Country)
            .NotEmpty()
            .WithMessage("Country is required")
            .MaximumLength(100);

        RuleFor(x => x.EmergencyContact)
            .NotNull()
            .WithMessage("Emergency contact is required for patients");

        RuleFor(x => x.EmergencyContact.FullName)
            .NotEmpty()
            .WithMessage("Emergency contact full name is required")
            .MaximumLength(100);

        RuleFor(x => x.EmergencyContact.PhoneNumber)
            .NotEmpty()
            .WithMessage("Emergency contact phone number is required")
            .Matches(@"^\+?[\d\s\-()]+$")
            .WithMessage("Invalid phone number format")
            .MaximumLength(20);

        RuleFor(x => x.EmergencyContact.Relationship)
            .NotEmpty()
            .WithMessage("Relationship is required")
            .MaximumLength(50);
    }

    private bool BeAValidDate(string dateString)
    {
        return DateTime.TryParse(dateString, out _);
    }
}
