using FluentValidation;

namespace Modules.Professionals.Features.Educations.UpdateEducation;

public class UpdateEducationCommandValidator : AbstractValidator<UpdateEducationCommand>
{
    public UpdateEducationCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.EducationId)
            .NotEmpty().WithMessage("Education ID is required.");

        RuleFor(x => x.Institution)
            .MaximumLength(300).WithMessage("Institution must not exceed 300 characters.")
            .When(x => !string.IsNullOrEmpty(x.Institution));

        RuleFor(x => x.Degree)
            .MaximumLength(200).WithMessage("Degree must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Degree));

        RuleFor(x => x.FieldOfStudy)
            .MaximumLength(200).WithMessage("Field of study must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.FieldOfStudy));

        RuleFor(x => x.Country)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.StartYear)
            .Matches(@"^\d{4}$").WithMessage("Start year must be a 4-digit year.")
            .When(x => !string.IsNullOrEmpty(x.StartYear));

        RuleFor(x => x.EndYear)
            .Matches(@"^\d{4}$").WithMessage("End year must be a 4-digit year.")
            .When(x => !string.IsNullOrEmpty(x.EndYear));
    }
}
