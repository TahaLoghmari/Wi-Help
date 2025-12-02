using FluentValidation;

namespace Modules.Professionals.Features.Experiences.DeleteExperience;

public class DeleteExperienceCommandValidator : AbstractValidator<DeleteExperienceCommand>
{
    public DeleteExperienceCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.ExperienceId)
            .NotEmpty().WithMessage("Experience ID is required.");
    }
}
