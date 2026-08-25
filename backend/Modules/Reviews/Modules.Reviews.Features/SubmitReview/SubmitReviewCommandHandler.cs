using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Abstractions;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Features.SubmitReview;

internal sealed class SubmitReviewCommandHandler(
    ISubmitReviewPort reviews,
    ILogger<SubmitReviewCommandHandler> logger,
    IPatientsModuleApi patientsApi,
    IProfessionalModuleApi professionalsApi,
    INotificationsModuleApi notificationsApi) : ICommandHandler<SubmitReviewCommand>
{
    public async Task<Result> Handle(SubmitReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Submitting {Type} review: Patient {PatientId}, Professional {ProfessionalId}",
            command.Type, command.PatientId, command.ProfessionalId);

        var patientsResult = await patientsApi.GetPatientsByIdsAsync([command.PatientId], cancellationToken);
        if (!patientsResult.IsSuccess || patientsResult.Value.Count == 0)
            return Result.Failure(ReviewErrors.PatientNotFound(command.PatientId));

        var professionalsResult = await professionalsApi.GetProfessionalsByIdsAsync(
            [command.ProfessionalId], cancellationToken);
        if (!professionalsResult.IsSuccess || professionalsResult.Value.Count == 0)
            return Result.Failure(ReviewErrors.ProfessionalNotFound(command.ProfessionalId));

        var exists = await reviews.ExistsAsync(
            command.PatientId, command.ProfessionalId, command.Type, cancellationToken);

        if (exists)
            return Result.Failure(ReviewErrors.AlreadyExists(command.PatientId, command.ProfessionalId));

        var review = new Review(
            command.PatientId,
            command.ProfessionalId,
            command.Comment,
            command.Rating,
            command.Type);

        await reviews.AddAsync(review, cancellationToken);

        logger.LogInformation("Review submitted with ID {ReviewId}", review.Id);

        // Notify the subject (the person being reviewed)
        var patient = patientsResult.Value[0];
        var professional = professionalsResult.Value[0];

        if (command.Type == ReviewType.ProfessionalReview)
        {
            var reviewerName = $"{patient.FirstName} {patient.LastName}";
            await notificationsApi.AddNotificationAsync(
                professional.UserId.ToString(), "Professional",
                "New Review Received",
                $"{reviewerName} has left you a {command.Rating}-star review.",
                NotificationType.newReview, cancellationToken);
        }
        else
        {
            var reviewerName = $"{professional.FirstName} {professional.LastName}";
            await notificationsApi.AddNotificationAsync(
                patient.UserId.ToString(), "Patient",
                "New Review Received",
                $"{reviewerName} has left you a {command.Rating}-star review.",
                NotificationType.newReview, cancellationToken);
        }

        return Result.Success();
    }
}
