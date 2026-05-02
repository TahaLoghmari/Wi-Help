using Modules.Common.Features.Abstractions;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Features.SubmitReview;

public sealed record SubmitReviewCommand(
    Guid PatientId,
    Guid ProfessionalId,
    string Comment,
    int Rating,
    ReviewType Type) : ICommand;
