using Modules.Common.Features.Results;

namespace Modules.Reviews.Domain;

public static class ReviewErrors
{
    public static Error NotFound(Guid id) => Error.NotFound(
        "Review.NotFound",
        $"Review with ID {id} was not found.");

    public static Error PatientNotFound(Guid patientId) => Error.NotFound(
        "Patient.NotFound",
        $"Patient with ID {patientId} was not found.");

    public static Error ProfessionalNotFound(Guid professionalId) => Error.NotFound(
        "Professional.NotFound",
        $"Professional with ID {professionalId} was not found.");

    public static Error AlreadyExists(Guid patientId, Guid professionalId) => Error.Conflict(
        "Review.AlreadyExists",
        $"Review already exists for patient {patientId} and professional {professionalId}.");

    public static Error InvalidRating(int rating) => Error.Validation(
        "Review.InvalidRating",
        $"Rating must be between 1 and 5. Provided rating: {rating}.");

    public static Error CommentRequired() => Error.Validation(
        "Review.CommentRequired",
        "Comment is required and cannot be empty.");

    public static Error CommentTooLong(int maxLength) => Error.Validation(
        "Review.CommentTooLong",
        $"Comment cannot exceed {maxLength} characters.");

    public static Error ReviewNotFound(Guid reviewId) => Error.NotFound(
        "Review.NotFound",
        $"Review with ID {reviewId} was not found.");

    public static Error AlreadyLiked(Guid reviewId, Guid userId) => Error.Conflict(
        "Review.AlreadyLiked",
        $"Review {reviewId} is already liked by user {userId}.");

    public static Error LikeNotFound(Guid reviewId, Guid userId) => Error.NotFound(
        "Review.LikeNotFound",
        $"Like not found for review {reviewId} by user {userId}.");

    public static Error ReplyNotFound(Guid replyId) => Error.NotFound(
        "Review.ReplyNotFound",
        $"Reply with ID {replyId} was not found.");
}

