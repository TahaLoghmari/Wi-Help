using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.ReplyToReview;

public sealed record ReplyToReviewCommand(
    Guid ReviewId,
    Guid UserId,
    string Comment) : ICommand;

