using FluentValidation;

namespace Modules.Professionals.Features.Auth.UpdateProfessional;

public class UpdateProfessionalCommandValidator : AbstractValidator<UpdateProfessionalCommand>
{
    public UpdateProfessionalCommandValidator()
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
                .MaximumLength(200)
                .WithMessage("Street cannot exceed 200 characters");

            RuleFor(x => x.Address!.City)
                .MaximumLength(100)
                .WithMessage("City cannot exceed 100 characters");

            RuleFor(x => x.Address!.State)
                .MaximumLength(100)
                .WithMessage("State/Province cannot exceed 100 characters");

            RuleFor(x => x.Address!.PostalCode)
                .MaximumLength(20)
                .WithMessage("Postal code cannot exceed 20 characters");

            RuleFor(x => x.Address!.Country)
                .MaximumLength(100)
                .WithMessage("Country cannot exceed 100 characters");
        });

        When(x => !string.IsNullOrWhiteSpace(x.Specialization), () =>
        {
            RuleFor(x => x.Specialization)
                .MaximumLength(100)
                .WithMessage("Specialization cannot exceed 100 characters");
        });

        When(x => x.Services != null && x.Services.Any(), () =>
        {
            RuleFor(x => x.Services)
                .Must(services => services!.All(s => !string.IsNullOrWhiteSpace(s)))
                .WithMessage("Services cannot contain empty values")
                .Must(services => services!.All(s => s.Length <= 100))
                .WithMessage("Each service cannot exceed 100 characters");
        });

        When(x => x.Experience.HasValue, () =>
        {
            RuleFor(x => x.Experience!.Value)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Years of experience must be at least 0")
                .LessThanOrEqualTo(60)
                .WithMessage("Years of experience cannot exceed 60");
        });

        When(x => x.StartPrice.HasValue, () =>
        {
            RuleFor(x => x.StartPrice!.Value)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Start price must be greater than or equal to 0");
        });

        When(x => x.EndPrice.HasValue, () =>
        {
            RuleFor(x => x.EndPrice!.Value)
                .GreaterThanOrEqualTo(0)
                .WithMessage("End price must be greater than or equal to 0");
        });

        When(x => x.StartPrice.HasValue && x.EndPrice.HasValue, () =>
        {
            RuleFor(x => x)
                .Must(cmd => cmd.EndPrice >= cmd.StartPrice)
                .WithMessage("End price must be greater than or equal to start price");
        });

        When(x => !string.IsNullOrWhiteSpace(x.Bio), () =>
        {
            RuleFor(x => x.Bio)
                .MaximumLength(1000)
                .WithMessage("Bio cannot exceed 1000 characters");
        });
    }
}
