using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.DeleteReview;

public record DeleteReviewCommand(
    Guid ReviewId,
    Guid PatientId) : ICommand;
