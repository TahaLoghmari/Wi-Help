using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.Auth.Register;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    string Role, 
    Address Address,
    EmergencyContact? EmergencyContact,
    string? Specialization,
    int? Experience) : ICommand;
