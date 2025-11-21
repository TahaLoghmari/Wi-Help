using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.Features.Auth.RegisterPatient;

public sealed record RegisterPatientCommand(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    Address Address,
    EmergencyContact EmergencyContact) : ICommand;
