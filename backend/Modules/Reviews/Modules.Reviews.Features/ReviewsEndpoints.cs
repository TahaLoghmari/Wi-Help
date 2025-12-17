namespace Modules.Reviews.Features;

public static class ReviewsEndpoints
{
    // Submit a review (patient submitting a review for a professional)
    public const string SubmitReview = "reviews";
    
    // Submit a review for a patient (professional submitting a review for a patient)
    public const string SubmitPatientReview = "reviews/patient";

    // Get reviews for a professional
    public const string GetProfessionalReviews = "reviews/professional/{professionalId}";

    // Get review statistics for a professional (average rating, total count)
    public const string GetProfessionalReviewStats = "reviews/professional/{professionalId}/stats";
    
    // Get reviews for a patient
    public const string GetPatientReviews = "reviews/patient/{patientId}";
    
    // Get review statistics for a patient (average rating, total count)
    public const string GetPatientReviewStats = "reviews/patient/{patientId}/stats";

    // Like/Unlike a review (POST to like, DELETE to unlike)
    public const string LikeReview = "reviews/{reviewId}/like";
    public const string UnlikeReview = "reviews/{reviewId}/like"; // Same URL, different HTTP method (DELETE)

    // Reply to a review
    public const string ReplyToReview = "reviews/{reviewId}/reply";

    // Edit a review (patient can edit their own review)
    public const string EditReview = "reviews/{reviewId}";

    // Delete a review (patient can delete their own review)
    public const string DeleteReview = "reviews/{reviewId}";

    public const string GetReviewsForAdmin = "reviews/admin";
    public const string DeleteReviewForAdmin = "reviews/admin/{reviewId}";
}

