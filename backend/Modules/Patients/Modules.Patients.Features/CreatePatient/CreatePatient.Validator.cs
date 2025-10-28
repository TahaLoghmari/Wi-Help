using FluentValidation;

namespace Modules.Patients.Features.CreatePatient;

public class CreatePatientCommandValidator : AbstractValidator<CreatePatientCommand>
{
    public CreatePatientCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("UserId is required.");

        RuleFor(x => x.Street)
            .NotEmpty()
            .WithMessage("Street is required.")
            .MaximumLength(100)
            .WithMessage("Street must be at most 100 characters.");

        RuleFor(x => x.City)
            .NotEmpty()
            .WithMessage("City is required.")
            .MaximumLength(50)
            .WithMessage("City must be at most 50 characters.");

        RuleFor(x => x.PostalCode)
            .NotEmpty()
            .WithMessage("Postal Code is required.")
            .MaximumLength(20)
            .WithMessage("Postal Code must be at most 20 characters.");

        RuleFor(x => x.Country)
            .NotEmpty()
            .WithMessage("Country is required.")
            .MaximumLength(50)
            .WithMessage("Country must be at most 50 characters.");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude must be between -90 and 90.");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude must be between -180 and 180.");

        RuleFor(x => x.EmergencyFullName)
            .NotEmpty()
            .WithMessage("Emergency contact full name is required.")
            .MaximumLength(100)
            .WithMessage("Emergency contact full name must be at most 100 characters.");

        RuleFor(x => x.EmergencyPhoneNumber)
            .NotEmpty()
            .WithMessage("Emergency contact phone number is required.")
            .MaximumLength(20)
            .WithMessage("Emergency contact phone number must be at most 20 characters.")
            .Matches(@"^\+?[\d\s\-()]+$")
            .WithMessage("Please enter a valid emergency contact phone number.");

        RuleFor(x => x.EmergencyRelationship)
            .NotEmpty()
            .WithMessage("Emergency contact relationship is required.")
            .MaximumLength(50)
            .WithMessage("Emergency contact relationship must be at most 50 characters.");
    }
}