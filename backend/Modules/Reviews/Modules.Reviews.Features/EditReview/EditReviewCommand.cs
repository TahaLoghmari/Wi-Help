using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.EditReview;

public record EditReviewCommand(
    Guid ReviewId,
    Guid PatientId,
    string Comment,
    int Rating) : ICommand;
