using FluentValidation;

namespace Modules.Reviews.Features.LikeReview;

public class LikeReviewCommandValidator : AbstractValidator<LikeReviewCommand>
{
    public LikeReviewCommandValidator()
    {
        RuleFor(x => x.ReviewId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
