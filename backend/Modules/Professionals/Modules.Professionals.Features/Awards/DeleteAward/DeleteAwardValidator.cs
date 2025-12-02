using FluentValidation;

namespace Modules.Professionals.Features.Awards.DeleteAward;

public class DeleteAwardCommandValidator : AbstractValidator<DeleteAwardCommand>
{
    public DeleteAwardCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.AwardId)
            .NotEmpty().WithMessage("Award ID is required.");
    }
}
