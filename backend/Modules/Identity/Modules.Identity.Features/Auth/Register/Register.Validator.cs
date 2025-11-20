using FluentValidation;
using Modules.Identity.Domain;

namespace Modules.Identity.Features.Auth.Register;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First Name is required.")
            .MaximumLength(50)
            .WithMessage("First Name must be at most 50 characters.");
        
        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last Name is required.")
            .MaximumLength(50)
            .WithMessage("Last Name must be at most 50 characters.");
        
        RuleFor(x => x.DateOfBirth)
            .NotEmpty()
            .WithMessage("Date of Birth is required.")
            .Must(BeValidDate)
            .WithMessage("Invalid date format.")
            .Must(NotBeInFuture)
            .WithMessage("Date of Birth cannot be in the future.");
        
        RuleFor(x => x.Gender)
            .NotEmpty()
            .WithMessage("Gender is required.")
            .Must(g => g.ToLower() == "male" || g.ToLower() == "female")
            .WithMessage("Gender must be either male or female.");
        
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .MaximumLength(20)
            .Matches(@"^\+?[\d\s\-()]+$")
            .WithMessage("Please enter a valid phone number.");
        
        RuleFor(x => x.Role)
            .NotEmpty()
            .WithMessage("Role is required.")
            .Must(r => IdentityConstants.Roles.Contains(r))
            .WithMessage("Invalid role. Must be one of: Admin, Patient, Professional.");
        
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Invalid email format.")
            .MaximumLength(256)
            .WithMessage("Email must be at most 256 characters.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long.")
            .MaximumLength(100)
            .WithMessage("Password must be at most 100 characters long.")
            .Must(ContainUppercase)
            .WithMessage("Password must contain at least one uppercase letter (A-Z).")
            .Must(ContainLowercase)
            .WithMessage("Password must contain at least one lowercase letter (a-z).")
            .Must(ContainDigit)
            .WithMessage("Password must contain at least one digit (0-9).")
            .Must(ContainNonAlphanumeric)
            .WithMessage("Password must contain at least one non-alphanumeric character (!@#$%^&*()_+-=[]{}|;:,.<>?).");
        
        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Password and confirmation password do not match.");
        
        RuleFor(x => x.Address.Street)
            .NotEmpty()
            .WithMessage("Street is required.")
            .MaximumLength(200)
            .WithMessage("Street must be at most 200 characters.");
        
        RuleFor(x => x.Address.City)
            .NotEmpty()
            .WithMessage("City is required.")
            .MaximumLength(100)
            .WithMessage("City must be at most 100 characters.");
        
        RuleFor(x => x.Address.PostalCode)
            .NotEmpty()
            .WithMessage("Postal Code is required.")
            .MaximumLength(20)
            .WithMessage("Postal Code must be at most 20 characters.");
        
        RuleFor(x => x.Address.Country)
            .NotEmpty()
            .WithMessage("Country is required.")
            .MaximumLength(100)
            .WithMessage("Country must be at most 100 characters.");
        
        RuleFor(x => x.Address.State )
            .NotEmpty()
            .WithMessage("State is required.")
            .MaximumLength(100)
            .WithMessage("State must be at most 100 characters.");
        
        When(x => x.Role.Equals("patient", StringComparison.OrdinalIgnoreCase), () =>
        {
            RuleFor(x => x.EmergencyContact)
                .NotNull()
                .WithMessage("Emergency contact is required for patients");

            RuleFor(x => x.EmergencyContact!.FullName)
                .NotEmpty()
                .WithMessage("Emergency contact full name is required")
                .MaximumLength(100);
    
            RuleFor(x => x.EmergencyContact!.PhoneNumber)
                .NotEmpty()
                .WithMessage("Emergency contact phone number is required")
                .Matches(@"^\+?[\d\s\-()]+$")
                .WithMessage("Invalid phone number format")
                .MaximumLength(20);
    
            RuleFor(x => x.EmergencyContact!.Relationship)
                .NotEmpty()
                .WithMessage("Relationship is required")
                .MaximumLength(50);
        });

        
        When(x => x.Role.Equals("professional", StringComparison.OrdinalIgnoreCase), () =>
        {
            RuleFor(x => x.Specialization)
                .NotNull()
                .WithMessage("Specialization is required for professionals");
        
            RuleFor(x => x.YearsOfExperience)
                .NotNull()
                .WithMessage("Years of Experience is required for professionals");
        });
        
    }
    
    private static bool ContainUppercase(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(char.IsUpper);
    }

    private static bool ContainLowercase(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(char.IsLower);
    }

    private static bool ContainDigit(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(char.IsDigit);
    }

    private static bool ContainNonAlphanumeric(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(ch => !char.IsLetterOrDigit(ch));
    }

    private static bool BeValidDate(string dateOfBirth)
    {
        return DateTime.TryParse(dateOfBirth, out _);
    }

    private static bool NotBeInFuture(string dateOfBirth)
    {
        if (DateTime.TryParse(dateOfBirth, out var parsedDate))
        {
            return parsedDate.Date <= DateTime.UtcNow.Date;
        }
        return false;
    }
}