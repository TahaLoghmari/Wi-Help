namespace Modules.Reviews.Features;

public static class ReviewsEndpoints
{
    // Submit a review (patient submitting a review for a professional)
    public const string SubmitReview = "reviews";

    // Get reviews for a professional
    public const string GetProfessionalReviews = "reviews/professional/{professionalId}";

    // Get review statistics for a professional (average rating, total count)
    public const string GetProfessionalReviewStats = "reviews/professional/{professionalId}/stats";

    // Like/Unlike a review (POST to like, DELETE to unlike)
    public const string LikeReview = "reviews/{reviewId}/like";
    public const string UnlikeReview = "reviews/{reviewId}/like"; // Same URL, different HTTP method (DELETE)

    // Reply to a review
    public const string ReplyToReview = "reviews/{reviewId}/reply";

    // Edit a review (patient can edit their own review)
    public const string EditReview = "reviews/{reviewId}";

    // Delete a review (patient can delete their own review)
    public const string DeleteReview = "reviews/{reviewId}";
}

