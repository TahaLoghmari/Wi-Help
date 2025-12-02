using FluentValidation;

namespace Modules.Professionals.Features.Experiences.CreateExperience;

public class CreateExperienceCommandValidator : AbstractValidator<CreateExperienceCommand>
{
    public CreateExperienceCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Organization)
            .NotEmpty().WithMessage("Organization is required.")
            .MaximumLength(300).WithMessage("Organization must not exceed 300 characters.");

        RuleFor(x => x.Location)
            .MaximumLength(200).WithMessage("Location must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartYear)
            .NotEmpty().WithMessage("Start year is required.")
            .Matches(@"^\d{4}$").WithMessage("Start year must be a 4-digit year.");

        RuleFor(x => x.EndYear)
            .Matches(@"^\d{4}$").WithMessage("End year must be a 4-digit year.")
            .When(x => !string.IsNullOrEmpty(x.EndYear));

        RuleFor(x => x)
            .Must(x => x.IsCurrentPosition || !string.IsNullOrEmpty(x.EndYear))
            .WithMessage("End year is required when not a current position.");

        RuleFor(x => x)
            .Must(x =>
            {
                if (string.IsNullOrEmpty(x.EndYear) || x.IsCurrentPosition) return true;
                if (int.TryParse(x.StartYear, out var start) && int.TryParse(x.EndYear, out var end))
                {
                    return end >= start;
                }
                return true;
            })
            .WithMessage("End year must be after or equal to start year.");
    }
}
