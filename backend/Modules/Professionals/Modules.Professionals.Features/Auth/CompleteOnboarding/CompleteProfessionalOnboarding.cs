using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.CompleteOnboarding;

internal sealed class CompleteProfessionalOnboarding : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.CompleteOnboarding, async (
                Request request,
                ClaimsPrincipal user,
                ICommandHandler<CompleteProfessionalOnboardingCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Results.Unauthorized();
                }

                CompleteProfessionalOnboardingCommand command = new CompleteProfessionalOnboardingCommand(
                    Guid.Parse(userId),
                    request.DateOfBirth,
                    request.Gender,
                    request.PhoneNumber,
                    request.Address,
                    request.Specialization,
                    request.Experience);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.Professionals);
    }

    private sealed record Request(
        string DateOfBirth,
        string Gender,
        string PhoneNumber,
        Address Address,
        string Specialization,
        int Experience);
}
