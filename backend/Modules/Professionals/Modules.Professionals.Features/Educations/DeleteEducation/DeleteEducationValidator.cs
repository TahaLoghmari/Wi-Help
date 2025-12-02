using FluentValidation;

namespace Modules.Professionals.Features.Educations.DeleteEducation;

public class DeleteEducationCommandValidator : AbstractValidator<DeleteEducationCommand>
{
    public DeleteEducationCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.EducationId)
            .NotEmpty().WithMessage("Education ID is required.");
    }
}
