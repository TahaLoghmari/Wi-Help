using Modules.Common.Features.Abstractions;
namespace Modules.Identity.Features.Auth.Register;

public sealed record RegisterCommand(
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Address,
    string Gender,
    string PhoneNumber,
    string Email,
    string Password,
    string ConfirmPassword,
    string Role) : ICommand;