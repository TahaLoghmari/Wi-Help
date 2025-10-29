using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.Auth.Register;

public sealed record RegisterCommand(
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    string Email,
    string Password,
    string ConfirmPassword,
    string Role, 
    Address Address,
    EmergencyContact? EmergencyContact,
    string? Specialization,
    int? YearsOfExperience) : ICommand;
