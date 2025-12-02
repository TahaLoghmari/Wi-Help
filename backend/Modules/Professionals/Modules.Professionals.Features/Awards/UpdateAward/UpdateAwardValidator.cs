using FluentValidation;

namespace Modules.Professionals.Features.Awards.UpdateAward;

public class UpdateAwardCommandValidator : AbstractValidator<UpdateAwardCommand>
{
    public UpdateAwardCommandValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Professional ID is required.");

        RuleFor(x => x.AwardId)
            .NotEmpty().WithMessage("Award ID is required.");

        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.Issuer)
            .MaximumLength(200).WithMessage("Issuer must not exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Issuer));

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.YearReceived)
            .Matches(@"^\d{4}$").WithMessage("Year must be a 4-digit number.")
            .Must(year => int.TryParse(year, out var y) && y <= DateTime.UtcNow.Year)
            .WithMessage("Year received cannot be in the future.")
            .When(x => !string.IsNullOrEmpty(x.YearReceived));
    }
}
