namespace Modules.Reviews.Features.GetProfessionalReviews;

public record ReviewReplyDto(
    Guid Id,
    Guid ReviewId,
    Guid UserId,
    string Comment,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string? UserFirstName,
    string? UserLastName,
    string? UserProfilePictureUrl,
    bool IsProfessional);

