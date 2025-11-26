using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.GetProfessionalAvailability;

public sealed record GetProfessionalAvailabilityQuery(
    Guid ProfessionalId,
    int Year,
    int Month) : IQuery<MonthlyAvailabilityResponse>;