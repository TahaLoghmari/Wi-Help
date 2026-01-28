using FluentValidation;

namespace Modules.Professionals.Features.Auth.UpdateProfessional;

public class UpdateProfessionalCommandValidator : AbstractValidator<UpdateProfessionalCommand>
{
    public UpdateProfessionalCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First name is required")
            .MaximumLength(100)
            .WithMessage("First name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z\s]+$")
            .WithMessage("First name must contain only letters and spaces");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last name is required")
            .MaximumLength(100)
            .WithMessage("Last name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z\s]+$")
            .WithMessage("Last name must contain only letters and spaces");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("Phone number is required")
            .Matches(@"^\+?[\d\s\-()]+$")
            .WithMessage("Invalid phone number format")
            .MaximumLength(20)
            .WithMessage("Phone number cannot exceed 20 characters");

        RuleFor(x => x.Address)
            .NotNull()
            .WithMessage("Address is required");

        When(x => x.Address != null, () =>
        {
            RuleFor(x => x.Address!.Street)
                .NotEmpty()
                .WithMessage("Street is required")
                .MaximumLength(200)
                .WithMessage("Street cannot exceed 200 characters");

            RuleFor(x => x.Address!.City)
                .NotEmpty()
                .WithMessage("City is required")
                .MaximumLength(100)
                .WithMessage("City cannot exceed 100 characters");

            RuleFor(x => x.Address!.State)
                .NotEmpty()
                .WithMessage("State/Province is required")
                .MaximumLength(100)
                .WithMessage("State/Province cannot exceed 100 characters");

            RuleFor(x => x.Address!.PostalCode)
                .NotEmpty()
                .WithMessage("Postal code is required")
                .MaximumLength(20)
                .WithMessage("Postal code cannot exceed 20 characters");

            RuleFor(x => x.Address!.Country)
                .NotEmpty()
                .WithMessage("Country is required")
                .MaximumLength(100)
                .WithMessage("Country cannot exceed 100 characters");
        });

        RuleFor(x => x.Specialization)
            .NotEmpty()
            .WithMessage("Specialization is required")
            .MaximumLength(100)
            .WithMessage("Specialization cannot exceed 100 characters");

        When(x => x.Services != null && x.Services.Any(), () =>
        {
            RuleFor(x => x.Services)
                .Must(services => services!.All(s => !string.IsNullOrWhiteSpace(s)))
                .WithMessage("Services cannot contain empty values")
                .Must(services => services!.All(s => s.Length <= 100))
                .WithMessage("Each service cannot exceed 100 characters");
        });

        RuleFor(x => x.Experience)
            .NotNull()
            .WithMessage("Years of experience is required")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Years of experience must be at least 0")
            .LessThanOrEqualTo(60)
            .WithMessage("Years of experience cannot exceed 60");

        RuleFor(x => x.VisitPrice)
            .NotNull()
            .WithMessage("Visit price is required")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Visit price must be greater than or equal to 0");

        When(x => !string.IsNullOrWhiteSpace(x.Bio), () =>
        {
            RuleFor(x => x.Bio)
                .MaximumLength(1000)
                .WithMessage("Bio cannot exceed 1000 characters");
        });
    }
}
