using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Features.GetReviews;

public sealed record ReviewDto(
    Guid Id,
    string Comment,
    int Rating,
    ReviewType Type,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    ReviewAuthorDto Author,
    int LikesCount,
    int RepliesCount,
    bool IsLiked,
    List<ReviewReplyDto> Replies);

public sealed record ReviewAuthorDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? ProfilePictureUrl);
