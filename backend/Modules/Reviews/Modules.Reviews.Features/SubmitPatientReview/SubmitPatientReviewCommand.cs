using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.SubmitPatientReview;

public sealed record SubmitPatientReviewCommand(
    Guid ProfessionalId,
    Guid PatientId,
    string Comment,
    int Rating) : ICommand;
