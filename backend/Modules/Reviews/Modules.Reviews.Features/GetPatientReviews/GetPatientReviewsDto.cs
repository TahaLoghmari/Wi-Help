using Modules.Professionals.PublicApi.Contracts;
using Modules.Reviews.Features.GetProfessionalReviews;

namespace Modules.Reviews.Features.GetPatientReviews;

public sealed record GetPatientReviewsDto(
    Guid Id,
    Guid PatientId,
    Guid ProfessionalId,
    string Comment,
    int Rating,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    ProfessionalDto Professional,
    int LikesCount,
    int RepliesCount,
    bool IsLiked,
    List<ReviewReplyDto> Replies);
