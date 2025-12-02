using FluentValidation;

namespace Modules.Professionals.Features.Educations.CreateEducation;

public class CreateEducationCommandValidator : AbstractValidator<CreateEducationCommand>
{
    public CreateEducationCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.Institution)
            .NotEmpty().WithMessage("Institution is required.")
            .MaximumLength(300).WithMessage("Institution must not exceed 300 characters.");

        RuleFor(x => x.Degree)
            .NotEmpty().WithMessage("Degree is required.")
            .MaximumLength(200).WithMessage("Degree must not exceed 200 characters.");

        RuleFor(x => x.FieldOfStudy)
            .MaximumLength(200).WithMessage("Field of study must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.FieldOfStudy));

        RuleFor(x => x.Country)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.StartYear)
            .NotEmpty().WithMessage("Start year is required.")
            .Matches(@"^\d{4}$").WithMessage("Start year must be a 4-digit year.");

        RuleFor(x => x.EndYear)
            .Matches(@"^\d{4}$").WithMessage("End year must be a 4-digit year.")
            .When(x => !string.IsNullOrEmpty(x.EndYear));

        RuleFor(x => x)
            .Must(x => x.IsCurrentlyStudying || !string.IsNullOrEmpty(x.EndYear))
            .WithMessage("End year is required when not currently studying.");

        RuleFor(x => x)
            .Must(x =>
            {
                if (string.IsNullOrEmpty(x.EndYear) || x.IsCurrentlyStudying) return true;
                if (int.TryParse(x.StartYear, out var start) && int.TryParse(x.EndYear, out var end))
                {
                    return end >= start;
                }
                return true;
            })
            .WithMessage("End year must be after or equal to start year.");
    }
}
