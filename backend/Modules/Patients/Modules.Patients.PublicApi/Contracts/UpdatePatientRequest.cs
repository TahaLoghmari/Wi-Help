using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.PublicApi.Contracts;

public record UpdatePatientRequest(
    Guid UserId,
    EmergencyContact? EmergencyContact);
