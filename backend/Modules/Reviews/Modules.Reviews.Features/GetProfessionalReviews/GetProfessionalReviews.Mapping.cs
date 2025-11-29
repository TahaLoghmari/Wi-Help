using Modules.Reviews.Domain.Entities;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Reviews.Features.GetProfessionalReviews;

public static class GetProfessionalReviewsMapping
{
    public static GetProfessionalReviewsDto ToDto(
        this Review review,
        Dictionary<Guid, PatientDto> patientsMap,
        int likesCount,
        int repliesCount,
        bool isLiked,
        List<ReviewReplyDto> replies)
    {
        patientsMap.TryGetValue(review.PatientId, out var patient);

        return new GetProfessionalReviewsDto(
            review.Id,
            review.PatientId,
            review.ProfessionalId,
            review.Comment,
            review.Rating,
            review.CreatedAt,
            review.UpdatedAt,
            patient!,
            likesCount,
            repliesCount,
            isLiked,
            replies);
    }
}

