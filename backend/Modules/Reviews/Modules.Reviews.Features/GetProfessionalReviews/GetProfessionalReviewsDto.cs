using Modules.Patients.PublicApi.Contracts;

namespace Modules.Reviews.Features.GetProfessionalReviews;

public record GetProfessionalReviewsDto(
    Guid Id,
    Guid PatientId,
    Guid ProfessionalId,
    string Comment,
    int Rating,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    PatientDto Patient,
    int LikesCount,
    int RepliesCount,
    bool IsLiked,
    List<ReviewReplyDto> Replies);

