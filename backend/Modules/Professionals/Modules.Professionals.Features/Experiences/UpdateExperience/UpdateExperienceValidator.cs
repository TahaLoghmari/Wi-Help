using FluentValidation;

namespace Modules.Professionals.Features.Experiences.UpdateExperience;

public class UpdateExperienceCommandValidator : AbstractValidator<UpdateExperienceCommand>
{
    public UpdateExperienceCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.ExperienceId)
            .NotEmpty().WithMessage("Experience ID is required.");

        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.Organization)
            .MaximumLength(300).WithMessage("Organization must not exceed 300 characters.")
            .When(x => !string.IsNullOrEmpty(x.Organization));

        RuleFor(x => x.Location)
            .MaximumLength(200).WithMessage("Location must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartYear)
            .Matches(@"^\d{4}$").WithMessage("Start year must be a 4-digit year.")
            .When(x => !string.IsNullOrEmpty(x.StartYear));

        RuleFor(x => x.EndYear)
            .Matches(@"^\d{4}$").WithMessage("End year must be a 4-digit year.")
            .When(x => !string.IsNullOrEmpty(x.EndYear));
    }
}
