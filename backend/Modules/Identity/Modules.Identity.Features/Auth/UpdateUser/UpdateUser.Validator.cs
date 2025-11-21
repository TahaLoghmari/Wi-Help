using FluentValidation;

namespace Modules.Identity.Features.Auth.UpdateUser;

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.FirstName)
            .MaximumLength(50)
            .WithMessage("First Name must be at most 50 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.FirstName));

        RuleFor(x => x.LastName)
            .MaximumLength(50)
            .WithMessage("Last Name must be at most 50 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.LastName));

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20)
            .WithMessage("Phone Number must be at most 20 characters.")
            .Matches(@"^\+?[\d\s\-()]+$")
            .WithMessage("Please enter a valid phone number.")
            .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber));

        When(x => x.Address != null, () =>
        {
            RuleFor(x => x.Address!.Street)
                .NotEmpty()
                .WithMessage("Street is required when updating address.")
                .MaximumLength(200)
                .WithMessage("Street must be at most 200 characters.");

            RuleFor(x => x.Address!.City)
                .NotEmpty()
                .WithMessage("City is required when updating address.")
                .MaximumLength(100)
                .WithMessage("City must be at most 100 characters.");

            RuleFor(x => x.Address!.PostalCode)
                .NotEmpty()
                .WithMessage("Postal Code is required when updating address.")
                .MaximumLength(20)
                .WithMessage("Postal Code must be at most 20 characters.");

            RuleFor(x => x.Address!.Country)
                .NotEmpty()
                .WithMessage("Country is required when updating address.")
                .MaximumLength(100)
                .WithMessage("Country must be at most 100 characters.");

            RuleFor(x => x.Address!.State)
                .NotEmpty()
                .WithMessage("State is required when updating address.")
                .MaximumLength(100)
                .WithMessage("State must be at most 100 characters.");
        });

        When(x => x.EmergencyContact != null, () =>
        {
            RuleFor(x => x.EmergencyContact!.FullName)
                .NotEmpty()
                .WithMessage("Emergency contact full name is required.")
                .MaximumLength(100)
                .WithMessage("Emergency contact full name must be at most 100 characters.");

            RuleFor(x => x.EmergencyContact!.PhoneNumber)
                .NotEmpty()
                .WithMessage("Emergency contact phone number is required.")
                .Matches(@"^\+?[\d\s\-()]+$")
                .WithMessage("Please enter a valid emergency contact phone number.");

            RuleFor(x => x.EmergencyContact!.Relationship)
                .NotEmpty()
                .WithMessage("Emergency contact relationship is required.")
                .MaximumLength(50)
                .WithMessage("Emergency contact relationship must be at most 50 characters.");
        });

        RuleFor(x => x.Specialization)
            .NotEmpty()
            .WithMessage("Specialization cannot be empty.")
            .MaximumLength(100)
            .WithMessage("Specialization must be at most 100 characters.")
            .When(x => x.Specialization != null);

        RuleFor(x => x.Services)
            .Must(services => services != null && services.All(s => !string.IsNullOrWhiteSpace(s)))
            .WithMessage("All services must have valid names.")
            .When(x => x.Services != null);

        RuleFor(x => x.Experience)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Experience cannot be negative.")
            .LessThanOrEqualTo(70)
            .WithMessage("Experience seems unrealistic (max 70 years).")
            .When(x => x.Experience.HasValue);

        RuleFor(x => x.StartPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Start price cannot be negative.")
            .When(x => x.StartPrice.HasValue);

        RuleFor(x => x.EndPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("End price cannot be negative.")
            .When(x => x.EndPrice.HasValue);

        RuleFor(x => x)
            .Must(x => !x.StartPrice.HasValue || !x.EndPrice.HasValue || x.StartPrice.Value <= x.EndPrice.Value)
            .WithMessage("Start price must be less than or equal to end price.")
            .When(x => x.StartPrice.HasValue && x.EndPrice.HasValue);

        RuleFor(x => x.Bio)
            .MaximumLength(1000)
            .WithMessage("Bio must be at most 1000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Bio));
    }
}
