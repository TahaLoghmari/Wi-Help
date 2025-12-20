using FluentValidation;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public class UpdatePatientCommandValidator : AbstractValidator<UpdatePatientCommand>
{
    public UpdatePatientCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First name is required")
            .MaximumLength(100)
            .WithMessage("First name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z]+$")
            .WithMessage("First name must contain only letters");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last name is required")
            .MaximumLength(100)
            .WithMessage("Last name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z]+$")
            .WithMessage("Last name must contain only letters");

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

        RuleFor(x => x.EmergencyContact)
            .NotNull()
            .WithMessage("Emergency contact is required");

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

            RuleFor(x => x.EmergencyContact!.Relationship)
                .NotEmpty()
                .WithMessage("Relationship is required")
                .MaximumLength(50)
                .WithMessage("Relationship cannot exceed 50 characters");
        });

        When(x => x.MedicalInfo != null, () =>
        {
            RuleFor(x => x.MedicalInfo!.MobilityStatus)
                .IsInEnum()
                .WithMessage("Invalid mobility status");

            RuleForEach(x => x.MedicalInfo!.ChronicConditions)
                .NotEmpty()
                .WithMessage("Chronic condition cannot be empty")
                .MaximumLength(200)
                .WithMessage("Chronic condition cannot exceed 200 characters");

            RuleForEach(x => x.MedicalInfo!.Allergies)
                .NotEmpty()
                .WithMessage("Allergy cannot be empty")
                .MaximumLength(200)
                .WithMessage("Allergy cannot exceed 200 characters");

            RuleForEach(x => x.MedicalInfo!.Medications)
                .NotEmpty()
                .WithMessage("Medication cannot be empty")
                .MaximumLength(200)
                .WithMessage("Medication cannot exceed 200 characters");
        });

        When(x => !string.IsNullOrWhiteSpace(x.Bio), () =>
        {
            RuleFor(x => x.Bio)
                .MaximumLength(1000)
                .WithMessage("Bio cannot exceed 1000 characters");
        });
    }
}
