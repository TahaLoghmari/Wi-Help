using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Notifications.PublicApi;
using Modules.Notifications.Domain.Enums;
using Modules.Identity.PublicApi;

namespace Modules.Reviews.Features.SubmitPatientReview;

public class SubmitPatientReviewCommandHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<SubmitPatientReviewCommandHandler> logger,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    INotificationsModuleApi notificationsModuleApi,
    IIdentityModuleApi identityModuleApi) : ICommandHandler<SubmitPatientReviewCommand>
{
    public async Task<Result> Handle(SubmitPatientReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Submitting review for professional {ProfessionalId} to patient {PatientId} with rating {Rating}",
            command.ProfessionalId, command.PatientId, command.Rating);

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
                r => r.PatientId == command.PatientId && 
                     r.ProfessionalId == command.ProfessionalId &&
                     r.Type == ReviewType.PatientReview,
                cancellationToken);

        if (existingReview != null)
        {
            logger.LogWarning(
                "Review already exists for professional {ProfessionalId} and patient {PatientId}",
                command.ProfessionalId, command.PatientId);
            return Result.Failure(ReviewErrors.AlreadyExists(command.PatientId, command.ProfessionalId));
        }

        var review = new Review(
            command.PatientId,
            command.ProfessionalId,
            command.Comment,
            command.Rating,
            ReviewType.PatientReview);

        reviewsDbContext.Reviews.Add(review);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Patient review submitted with ID {ReviewId}", review.Id);

        // Send notification to the patient
        var patient = patientsResult.Value.First();
        var professional = professionalResult.Value.First();
        var professionalName = $"{professional.FirstName} {professional.LastName}";

        // Get patient's userId
        var userResult = await identityModuleApi.GetUserByIdAsync(patient.UserId, cancellationToken);
        if (!userResult.IsSuccess)
        {
            logger.LogWarning("Failed to fetch user details for notification: {Error}", userResult.Error);
            return Result.Success(); // Still return success as the review was saved
        }

        await notificationsModuleApi.AddNotificationAsync(
            patient.UserId.ToString(),
            "Patient",
            "New Review Received",
            $"{professionalName} has left you a {command.Rating}-star review.",
            NotificationType.newReview,
            cancellationToken);

        return Result.Success();
    }
}
