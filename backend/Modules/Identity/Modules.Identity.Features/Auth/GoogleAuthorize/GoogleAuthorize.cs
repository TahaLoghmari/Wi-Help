using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Identity.Infrastructure.Services;

namespace Modules.Identity.Features.Auth.GoogleAuthorize;

internal sealed class GoogleAuthorize : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(IdentityEndpoints.GoogleAuthorize, (
                string? role,
                GoogleTokensProvider googleTokensProvider) =>
            {
                // For sign-in, role can be null/empty. For sign-up, it must be Patient or Professional
                if (!string.IsNullOrEmpty(role) && role != "Patient" && role != "Professional")
                {
                    return Results.BadRequest(new { error = "Invalid role. Must be 'Patient' or 'Professional'." });
                }

                // Pass role as-is (can be null for sign-in flow)
                var authorizationUrl = googleTokensProvider.GenerateAuthorizationUrl(role);

                return Results.Ok(new GoogleAuthResponseDto(authorizationUrl));
            })
            .WithTags(Tags.Authentication);
    }
}

public sealed record GoogleAuthResponseDto(string AuthorizationUrl);
