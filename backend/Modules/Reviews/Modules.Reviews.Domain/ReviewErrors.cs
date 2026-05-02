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

    public static Error AlreadyLiked(Guid reviewId, Guid userId) => Error.Conflict(
        "Review.AlreadyLiked",
        $"Review {reviewId} is already liked by user {userId}.");

    public static Error LikeNotFound(Guid reviewId, Guid userId) => Error.NotFound(
        "Review.LikeNotFound",
        $"Like not found for review {reviewId} by user {userId}.");

    public static Error ReplyNotFound(Guid replyId) => Error.NotFound(
        "Review.ReplyNotFound",
        $"Reply with ID {replyId} was not found.");

    public static Error NotAuthor(Guid reviewId) => Error.Unauthorized(
        "Review.NotAuthor",
        $"You are not the author of review {reviewId}.");

    public static Error NotReplyOwner(Guid replyId) => Error.Unauthorized(
        "Review.NotReplyOwner",
        $"You are not the owner of reply {replyId}.");

    public static Error NotAuthorOrSubject(Guid reviewId) => Error.Unauthorized(
        "Review.NotAuthorOrSubject",
        $"You must be the author or subject of review {reviewId} to perform this action.");

    public static Error Unauthorized() => Error.Unauthorized(
        "Review.Unauthorized",
        "Could not resolve your identity from the token.");
}

