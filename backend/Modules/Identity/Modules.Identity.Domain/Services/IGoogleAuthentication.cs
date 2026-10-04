using Modules.Identity.Domain.DTOs;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Services;

public interface IGoogleAuthentication
{
    string GenerateAuthorizationUrl(string? role);
    Task<GoogleTokenResponse?> ExchangeCodeForTokensAsync(string? code, CancellationToken cancellationToken);
    Task<GoogleUserInfo?> GetGoogleUserInfoAsync(string idToken);
    Task<(User? user, bool isNewUser)> FindOrCreateUserAsync(GoogleUserInfo googleUser, string role, bool signInOnly, CancellationToken cancellationToken);
}
