using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.DeleteReview;

public sealed record DeleteReviewCommand(
    Guid ReviewId,
    Guid? CallerPatientId,
    Guid? CallerProfessionalId,
    bool IsAdmin) : ICommand;
