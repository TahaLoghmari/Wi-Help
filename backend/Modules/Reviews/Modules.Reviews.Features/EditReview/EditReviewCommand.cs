using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.EditReview;

public sealed record EditReviewCommand(
    Guid ReviewId,
    Guid? CallerPatientId,
    Guid? CallerProfessionalId,
    bool IsAdmin,
    string Comment,
    int Rating) : ICommand;
