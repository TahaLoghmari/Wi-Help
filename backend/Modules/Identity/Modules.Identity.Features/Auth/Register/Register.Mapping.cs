namespace Modules.Identity.Features.Auth.Register;

public sealed record RegisterResponse(
    Guid UserId,
    string Email,
    string Message);

