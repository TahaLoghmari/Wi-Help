using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.CompleteOnboarding;

public sealed record CompleteProfessionalOnboardingCommand(
    Guid UserId,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    Address Address,
    string Specialization,
    int Experience) : ICommand;
