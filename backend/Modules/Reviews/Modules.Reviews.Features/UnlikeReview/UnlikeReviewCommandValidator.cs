using FluentValidation;

namespace Modules.Reviews.Features.UnlikeReview;

public class UnlikeReviewCommandValidator : AbstractValidator<UnlikeReviewCommand>
{
    public UnlikeReviewCommandValidator()
    {
        RuleFor(x => x.ReviewId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
