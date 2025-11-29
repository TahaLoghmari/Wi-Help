using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Modules.Notifications.Infrastructure;

/// <summary>
/// Custom user ID provider for SignalR that uses the 'sub' claim from JWT tokens.
/// This ensures SignalR can correctly identify users when sending targeted notifications.
/// </summary>
public class UserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        // SignalR uses the 'sub' claim (JwtRegisteredClaimNames.Sub) for user identification
        // This is the same claim used in the JWT token generation
        // Check 'sub' first as it's the actual claim name in the JWT token
        return connection.User?.FindFirst("sub")?.Value
               ?? connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}

