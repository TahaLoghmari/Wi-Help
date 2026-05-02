namespace Modules.Reviews.Features.GetReviews;

public sealed record ReviewReplyDto(
    Guid Id,
    Guid ReviewId,
    Guid UserId,
    string Comment,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string? FirstName,
    string? LastName,
    string? ProfilePictureUrl);
