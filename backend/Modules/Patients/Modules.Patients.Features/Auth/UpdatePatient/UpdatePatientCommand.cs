using Microsoft.AspNetCore.Http;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.Enums;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public sealed record UpdatePatientCommand(
    Guid UserId,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    Address? Address,
    EmergencyContact? EmergencyContact,
    MobilityStatus? MobilityStatus,
    List<Guid>? AllergyIds,
    List<Guid>? ConditionIds,
    List<Guid>? MedicationIds,
    string? Bio,
    IFormFile? ProfilePicture) : ICommand;
