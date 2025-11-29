using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.UnlikeReview;

public sealed record UnlikeReviewCommand(
    Guid ReviewId,
    Guid UserId) : ICommand;

