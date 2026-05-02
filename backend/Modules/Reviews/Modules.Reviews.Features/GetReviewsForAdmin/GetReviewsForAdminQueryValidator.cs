using FluentValidation;

namespace Modules.Reviews.Features.GetReviewsForAdmin;

public class GetReviewsForAdminQueryValidator : AbstractValidator<GetReviewsForAdminQuery>
{
    public GetReviewsForAdminQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
