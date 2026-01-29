using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.Auth.ResetPassword;

internal sealed class GetResetPasswordPage : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(IdentityEndpoints.ResetPassword, (
                [FromQuery] string email,
                [FromQuery] string token,
                IConfiguration configuration) =>
            {
                var frontendUrl = configuration["FRONTEND_URL"] ;
                
                var redirectUrl = $"{frontendUrl}/auth/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";
                
                return Results.Redirect(redirectUrl);
            })
            .WithTags(Tags.Authentication);
    }
}
