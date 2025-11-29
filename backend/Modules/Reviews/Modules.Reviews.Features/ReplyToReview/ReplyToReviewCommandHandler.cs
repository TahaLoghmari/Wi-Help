using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;

namespace Modules.Reviews.Features.ReplyToReview;

public class ReplyToReviewCommandHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<ReplyToReviewCommandHandler> logger) : ICommandHandler<ReplyToReviewCommand>
{
    public async Task<Result> Handle(ReplyToReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Replying to review {ReviewId} by user {UserId}",
            command.ReviewId, command.UserId);

        // Validate comment
        if (string.IsNullOrWhiteSpace(command.Comment))
        {
            return Result.Failure(ReviewErrors.CommentRequired());
        }

        // Validate comment length
        const int maxCommentLength = 2000;
        if (command.Comment.Length > maxCommentLength)
        {
            logger.LogWarning("Reply comment exceeds maximum length of {MaxLength}", maxCommentLength);
            return Result.Failure(ReviewErrors.CommentTooLong(maxCommentLength));
        }

        // Check if review exists
        var reviewExists = await reviewsDbContext.Reviews
            .AnyAsync(r => r.Id == command.ReviewId, cancellationToken);

        if (!reviewExists)
        {
            logger.LogWarning("Review not found for ID {ReviewId}", command.ReviewId);
            return Result.Failure(ReviewErrors.ReviewNotFound(command.ReviewId));
        }

        var reply = new ReviewReply(
            command.ReviewId,
            command.UserId,
            command.Comment);

        reviewsDbContext.ReviewReplies.Add(reply);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Reply added to review {ReviewId} by user {UserId}", command.ReviewId, command.UserId);

        return Result.Success();
    }
}

