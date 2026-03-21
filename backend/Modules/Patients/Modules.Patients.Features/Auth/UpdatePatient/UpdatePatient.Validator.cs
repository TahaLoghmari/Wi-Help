using FluentValidation;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public class UpdatePatientCommandValidator : AbstractValidator<UpdatePatientCommand>
{
    public UpdatePatientCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        When(x => x.FirstName is not null, () =>
        {
            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage("First name is required")
                .MaximumLength(100)
                .WithMessage("First name cannot exceed 100 characters")
                .Matches(@"^[a-zA-Z\s]+$")
                .WithMessage("First name must contain only letters and spaces");
        });

        When(x => x.LastName is not null, () =>
        {
            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage("Last name is required")
                .MaximumLength(100)
                .WithMessage("Last name cannot exceed 100 characters")
                .Matches(@"^[a-zA-Z\s]+$")
                .WithMessage("Last name must contain only letters and spaces");
        });

        When(x => x.PhoneNumber is not null, () =>
        {
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .WithMessage("Phone number is required")
                .Matches(@"^\+?[\d\s\-()]+$")
                .WithMessage("Invalid phone number format")
                .MaximumLength(20)
                .WithMessage("Phone number cannot exceed 20 characters");
        });

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

            RuleFor(x => x.Address!.StateId)
                .NotEmpty()
                .WithMessage("State/Province is required");

            RuleFor(x => x.Address!.PostalCode)
                .NotEmpty()
                .WithMessage("Postal code is required")
                .MaximumLength(20)
                .WithMessage("Postal code cannot exceed 20 characters");

            RuleFor(x => x.Address!.CountryId)
                .NotEmpty()
                .WithMessage("Country is required");
        });

        When(x => x.EmergencyContact != null, () =>
        {
            RuleFor(x => x.EmergencyContact!.FullName)
                .NotEmpty()
                .WithMessage("Emergency contact full name is required")
                .MaximumLength(100)
                .WithMessage("Emergency contact full name cannot exceed 100 characters");

            RuleFor(x => x.EmergencyContact!.PhoneNumber)
                .NotEmpty()
                .WithMessage("Emergency contact phone number is required")
                .Matches(@"^\+?[\d\s\-()]+$")
                .WithMessage("Invalid emergency contact phone number format")
                .MaximumLength(20)
                .WithMessage("Emergency contact phone number cannot exceed 20 characters");

            RuleFor(x => x.EmergencyContact!.RelationshipId)
                .NotEmpty()
                .WithMessage("Relationship is required");
        });

        When(x => x.MobilityStatus != null, () =>
        {
            RuleFor(x => x.MobilityStatus)
                .IsInEnum()
                .WithMessage("Invalid mobility status");
        });

        When(x => !string.IsNullOrWhiteSpace(x.Bio), () =>
        {
            RuleFor(x => x.Bio)
                .MaximumLength(1000)
                .WithMessage("Bio cannot exceed 1000 characters");
        });
    }
}
