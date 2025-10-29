using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.PublicApi.Contracts;

public record CreatePatientRequest(
    Guid UserId,
    Address Address,
    EmergencyContact EmergencyContact);