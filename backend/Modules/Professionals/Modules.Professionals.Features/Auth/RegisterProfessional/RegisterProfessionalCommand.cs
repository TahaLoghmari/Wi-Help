using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.RegisterProfessional;

public sealed record RegisterProfessionalCommand(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    Address Address,
    string Specialization,
    int Experience) : ICommand;
