using Modules.Common.Features.Abstractions;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.PublicApi;

public interface IProfessionalModuleApi
{
    Task<MonthlyAvailabilityResponse> GetMonthlyAvailability(GetProfessionalAvailabilityByMonthQuery query);
}

public sealed record GetProfessionalAvailabilityByMonthQuery(
    Guid ProfessionalId,
    int Year,
    int Month,
    string TimeZoneId = "Africa/Tunis",
    bool IncludePastDays = false,
    bool IncludeBookedSlots = true) : IQuery<MonthlyAvailabilityResponse>;