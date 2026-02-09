using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Features.Auth.CompleteOnboarding;

public sealed record CompletePatientOnboardingCommand(
    Guid UserId,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    Address Address,
    EmergencyContact EmergencyContact) : ICommand;
