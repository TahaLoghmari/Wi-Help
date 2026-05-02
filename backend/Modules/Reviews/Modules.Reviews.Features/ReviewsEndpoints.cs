namespace Modules.Reviews.Features;

public static class ReviewsEndpoints
{
    // Reviews
    public const string SubmitReview = "reviews";
    public const string GetReviews = "reviews";
    public const string EditReview = "reviews/{reviewId}";
    public const string DeleteReview = "reviews/{reviewId}";

    // Review Stats
    public const string GetReviewStats = "reviews/stats";

    // Likes
    public const string LikeReview = "reviews/{reviewId}/like";
    public const string UnlikeReview = "reviews/{reviewId}/like";

    // Replies
    public const string ReplyToReview = "reviews/{reviewId}/replies";
    public const string EditReply = "reviews/{reviewId}/replies/{replyId}";
    public const string DeleteReply = "reviews/{reviewId}/replies/{replyId}";

    // Admin
    public const string GetReviewsForAdmin = "reviews/admin";
}

