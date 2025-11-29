using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Reviews.Features.SubmitReview;

public class SubmitReviewCommandHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<SubmitReviewCommandHandler> logger,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi) : ICommandHandler<SubmitReviewCommand>
{
    public async Task<Result> Handle(SubmitReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Submitting review for patient {PatientId} to professional {ProfessionalId} with rating {Rating}",
            command.PatientId, command.ProfessionalId, command.Rating);

        // Validate rating
        if (command.Rating < 1 || command.Rating > 5)
        {
            return Result.Failure(ReviewErrors.InvalidRating(command.Rating));
        }

        // Validate comment
        if (string.IsNullOrWhiteSpace(command.Comment))
        {
            return Result.Failure(ReviewErrors.CommentRequired());
        }

        // Validate comment length
        const int maxCommentLength = 2000;
        if (command.Comment.Length > maxCommentLength)
        {
            logger.LogWarning("Review comment exceeds maximum length of {MaxLength}", maxCommentLength);
            return Result.Failure(ReviewErrors.CommentTooLong(maxCommentLength));
        }

        // Validate patient exists
        var patientsResult = await patientsModuleApi.GetPatientsByIdsAsync([command.PatientId], cancellationToken);
        if (!patientsResult.IsSuccess || !patientsResult.Value.Any())
        {
            logger.LogWarning("Patient not found for ID {PatientId}", command.PatientId);
            return Result.Failure(ReviewErrors.PatientNotFound(command.PatientId));
        }

        // Validate professional exists
        var professionalResult = await professionalModuleApi.GetProfessionalsByIdsAsync([command.ProfessionalId], cancellationToken);
        if (!professionalResult.IsSuccess || !professionalResult.Value.Any())
        {
            logger.LogWarning("Professional not found for ID {ProfessionalId}", command.ProfessionalId);
            return Result.Failure(ReviewErrors.ProfessionalNotFound(command.ProfessionalId));
        }

        // Check if review already exists
        var existingReview = await reviewsDbContext.Reviews
            .FirstOrDefaultAsync(
                r => r.PatientId == command.PatientId && r.ProfessionalId == command.ProfessionalId,
                cancellationToken);

        if (existingReview != null)
        {
            logger.LogWarning(
                "Review already exists for patient {PatientId} and professional {ProfessionalId}",
                command.PatientId, command.ProfessionalId);
            return Result.Failure(ReviewErrors.AlreadyExists(command.PatientId, command.ProfessionalId));
        }

        var review = new Review(
            command.PatientId,
            command.ProfessionalId,
            command.Comment,
            command.Rating);

        reviewsDbContext.Reviews.Add(review);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review submitted with ID {ReviewId}", review.Id);

        return Result.Success();
    }
}

