using Microsoft.AspNetCore.Http;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public sealed record UpdatePatientCommand(
    Guid UserId,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    Address? Address,
    EmergencyContact? EmergencyContact,
    MedicalInfo? MedicalInfo,
    string? Bio,
    IFormFile? ProfilePicture) : ICommand;
