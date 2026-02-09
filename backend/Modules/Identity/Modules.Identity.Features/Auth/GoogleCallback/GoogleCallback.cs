using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Services;

namespace Modules.Identity.Features.Auth.GoogleCallback;

internal sealed class GoogleCallback : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(IdentityEndpoints.GoogleCallback, async (
                string? code,
                string? state,
                string? error,
                HttpContext httpContext,
                GoogleTokensProvider googleTokensProvider,
                TokenManagementService tokenManagementService,
                CookieService cookieService,
                UserManager<User> userManager,
                IConfiguration configuration,
                ILogger<GoogleCallback> logger,
                CancellationToken cancellationToken) =>
            {
                var frontendBaseUrl = configuration["FRONTEND_URL"] ?? "http://localhost:3000";

                if (!string.IsNullOrEmpty(error))
                {
                    logger.LogWarning("Google authentication canceled by user. Error: {Error}", error);
                    return Results.Redirect($"{frontendBaseUrl}/auth/login?error=google_canceled&message={Uri.EscapeDataString("Google authentication was canceled.")}");
                }

                if (string.IsNullOrEmpty(code))
                {
                    logger.LogWarning("Google callback received without code");
                    return Results.Redirect($"{frontendBaseUrl}/auth/login?error=no_code&message={Uri.EscapeDataString("No authorization code received from Google.")}");
                }

                // State contains the role (Patient or Professional) for sign-up, or "signin" for sign-in
                var isSignIn = state == "signin" || string.IsNullOrEmpty(state);
                var role = state ?? "Patient";
                if (role != "Patient" && role != "Professional")
                {
                    role = "Patient"; // Default to Patient if invalid role (for new users)
                }

                logger.LogInformation("Processing Google callback. IsSignIn: {IsSignIn}, Role: {Role}", isSignIn, role);

                // Exchange code for tokens
                var googleTokens = await googleTokensProvider.ExchangeCodeForTokensAsync(code, cancellationToken);
                if (googleTokens is null)
                {
                    logger.LogError("Failed to exchange code for tokens");
                    return Results.Redirect($"{frontendBaseUrl}/auth/login?error=token_exchange&message={Uri.EscapeDataString("Failed to authenticate with Google.")}");
                }

                // Get user info from Google
                var googleUser = await googleTokensProvider.GetGoogleUserInfoAsync(googleTokens.IdToken);
                if (googleUser is null)
                {
                    logger.LogError("Failed to get user info from Google");
                    return Results.Redirect($"{frontendBaseUrl}/auth/login?error=user_info&message={Uri.EscapeDataString("Failed to get user information from Google.")}");
                }

                // For sign-in flow, only find existing users. For sign-up, create if not exists.
                var (user, isNewUser) = await googleTokensProvider.FindOrCreateUserAsync(googleUser, role, isSignIn, cancellationToken);
                
                if (user is null && isSignIn)
                {
                    logger.LogWarning("Sign-in attempted but no account exists for Google email: {Email}", googleUser.Email);
                    return Results.Redirect($"{frontendBaseUrl}/auth/login?error=no_account&message={Uri.EscapeDataString("No account found. Please sign up first.")}");
                }
                
                if (user is null)
                {
                    logger.LogError("Failed to create or find user for Google account: {Email}", googleUser.Email);
                    return Results.Redirect($"{frontendBaseUrl}/auth/login?error=user_creation&message={Uri.EscapeDataString("Failed to create or link user account.")}");
                }

                // Get user role
                var userRoles = await userManager.GetRolesAsync(user);
                var userRole = userRoles.FirstOrDefault() ?? role;

                // Create tokens
                var accessTokens = await tokenManagementService.CreateAndStoreTokens(
                    user.Id,
                    userRole,
                    user.Email!,
                    cancellationToken);

                // Set cookies
                cookieService.AddCookies(httpContext.Response, accessTokens);

                logger.LogInformation("Google authentication successful for UserId: {UserId}, IsNewUser: {IsNewUser}, OnboardingCompleted: {OnboardingCompleted}",
                    user.Id, isNewUser, user.IsOnboardingCompleted);

                // Redirect based on onboarding status
                if (!user.IsOnboardingCompleted)
                {
                    return Results.Redirect($"{frontendBaseUrl}/auth/callback?onboarding=true&role={userRole.ToLower()}");
                }

                // Redirect to appropriate app based on role
                var redirectPath = userRole.ToLower() switch
                {
                    "admin" => "/admin",
                    "professional" => "/professional",
                    "patient" => "/patient",
                    _ => "/patient"
                };

                return Results.Redirect($"{frontendBaseUrl}{redirectPath}");
            })
            .WithTags(Tags.Authentication);
    }
}
