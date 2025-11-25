namespace Modules.Identity.Infrastructure.DTOs;

public sealed record TokenRequest( Guid UserId , string Email );