using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.LikeReview;

public sealed record LikeReviewCommand(
    Guid ReviewId,
    Guid UserId) : ICommand;

