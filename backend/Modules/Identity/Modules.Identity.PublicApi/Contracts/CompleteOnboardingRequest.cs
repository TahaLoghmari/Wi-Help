using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.PublicApi.Contracts;

public record CompleteOnboardingRequest(
    Guid UserId,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    Address Address);
