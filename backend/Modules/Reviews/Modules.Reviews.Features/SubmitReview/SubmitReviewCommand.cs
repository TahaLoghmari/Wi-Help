using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.SubmitReview;

public record SubmitReviewCommand(
    Guid PatientId,
    Guid ProfessionalId,
    string Comment,
    int Rating) : ICommand;

