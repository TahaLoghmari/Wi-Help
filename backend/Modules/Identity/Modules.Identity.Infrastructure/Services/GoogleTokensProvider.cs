using System.Text.Json;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.DTOs;
using Modules.Identity.Infrastructure.Settings;

namespace Modules.Identity.Infrastructure.Services;

public sealed class GoogleTokensProvider(
    UserManager<User> userManager,
    IOptions<GoogleSettings> googleSettings,
    ILogger<GoogleTokensProvider> logger,
    IHttpClientFactory httpClientFactory)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;

    public string GenerateAuthorizationUrl(string? role)
    {
        var clientId = _googleSettings.ClientId;
        var redirectUri = _googleSettings.RedirectUri!;
        var scope = _googleSettings.Scopes!;
        // For sign-in flow, role can be null. We use a special marker to indicate sign-in vs sign-up
        var state = string.IsNullOrEmpty(role) ? "signin" : role;

        var authUrl = $"https://accounts.google.com/o/oauth2/v2/auth?" +
                      $"client_id={clientId}&" +
                      $"redirect_uri={Uri.EscapeDataString(redirectUri)}&" +
                      $"scope={Uri.EscapeDataString(scope)}&" +
                      $"response_type=code&" +
                      $"state={state}&" +
                      $"access_type=offline&" +
                      $"prompt=consent";

        logger.LogInformation("Google authorization URL generated with state: {State}", state);

        return authUrl;
    }

    public async Task<GoogleTokenResponse?> ExchangeCodeForTokensAsync(
        string? code,
        CancellationToken cancellationToken)
    {
        var clientId = _googleSettings.ClientId;
        var clientSecret = _googleSettings.ClientSecret;
        var redirectUri = _googleSettings.RedirectUri;

        using var httpClient = httpClientFactory.CreateClient();

        var tokenRequest = new FormUrlEncodedContent(
        [
            new KeyValuePair<string, string>("code", code ?? string.Empty),
            new KeyValuePair<string, string>("client_id", clientId!),
            new KeyValuePair<string, string>("client_secret", clientSecret!),
            new KeyValuePair<string, string>("redirect_uri", redirectUri!),
            new KeyValuePair<string, string>("grant_type", "authorization_code")
        ]);

        var response = await httpClient.PostAsync(
            "https://oauth2.googleapis.com/token", 
            tokenRequest, 
            cancellationToken);
        
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogError("Failed to exchange code for tokens. Status: {StatusCode}, Response: {Response}",
                response.StatusCode, responseContent);
            return null;
        }

        var tokenResponse = JsonSerializer.Deserialize<GoogleTokenResponse>(responseContent);

        return tokenResponse;
    }

    public async Task<GoogleUserInfo?> GetGoogleUserInfoAsync(string idToken)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);

            return new GoogleUserInfo(
                payload.Subject,
                payload.Email,
                payload.Name,
                payload.GivenName,
                payload.FamilyName,
                payload.Picture);
        }
        catch (InvalidJwtException ex)
        {
            logger.LogError(ex, "Failed to validate Google ID token");
            return null;
        }
    }

    public async Task<(User? user, bool isNewUser)> FindOrCreateUserAsync(
        GoogleUserInfo googleUser,
        string role,
        bool signInOnly,
        CancellationToken cancellationToken)
    {
        var loginInfo = new UserLoginInfo("Google", googleUser.Id, "Google");

        // Check if user exists with this Google login
        var user = await userManager.FindByLoginAsync(loginInfo.LoginProvider, loginInfo.ProviderKey);

        if (user != null)
        {
            logger.LogInformation("Existing Google user found for GoogleId: {GoogleId}", googleUser.Id);
            
            // Update profile picture if changed
            if (user.ProfilePictureUrl != googleUser.Picture)
            {
                user.UpdateFromGoogle(googleUser.Id, googleUser.Picture);
                await userManager.UpdateAsync(user);
            }
            
            return (user, false);
        }

        // Check if user exists with this email
        user = await userManager.FindByEmailAsync(googleUser.Email);

        if (user != null)
        {
            logger.LogInformation("Existing user found by email: {Email}, linking Google account", googleUser.Email);
            
            var addLoginResult = await userManager.AddLoginAsync(user, loginInfo);
            if (!addLoginResult.Succeeded)
            {
                logger.LogError("Failed to link Google account. Errors: {Errors}",
                    string.Join(", ", addLoginResult.Errors.Select(e => e.Description)));
                return (null, false);
            }

            user.UpdateFromGoogle(googleUser.Id, googleUser.Picture);
            await userManager.UpdateAsync(user);
            
            return (user, false);
        }
        
        // For sign-in only flow, don't create new users
        if (signInOnly)
        {
            logger.LogInformation("Sign-in only mode: No existing user found for email: {Email}", googleUser.Email);
            return (null, false);
        }

        // Create new user
        logger.LogInformation("Creating new user from Google account: {Email}", googleUser.Email);

        user = User.CreateFromGoogle(
            googleUser.Id,
            googleUser.Email,
            googleUser.GivenName ?? string.Empty,
            googleUser.FamilyName ?? string.Empty,
            googleUser.Picture);

        var createResult = await userManager.CreateAsync(user);
        if (!createResult.Succeeded)
        {
            logger.LogError("Failed to create user. Errors: {Errors}",
                string.Join(", ", createResult.Errors.Select(e => e.Description)));
            return (null, false);
        }

        var linkResult = await userManager.AddLoginAsync(user, loginInfo);
        if (!linkResult.Succeeded)
        {
            logger.LogError("Failed to link Google login. Errors: {Errors}",
                string.Join(", ", linkResult.Errors.Select(e => e.Description)));
            await userManager.DeleteAsync(user);
            return (null, false);
        }

        // Add role
        var roleResult = await userManager.AddToRoleAsync(user, role);
        if (!roleResult.Succeeded)
        {
            logger.LogError("Failed to add role {Role}. Errors: {Errors}",
                role, string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            await userManager.DeleteAsync(user);
            return (null, false);
        }

        logger.LogInformation("New user created successfully. UserId: {UserId}, Role: {Role}", user.Id, role);

        return (user, true);
    }
}
