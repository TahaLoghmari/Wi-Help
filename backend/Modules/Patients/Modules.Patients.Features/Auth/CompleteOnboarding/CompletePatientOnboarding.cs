using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Features.Auth.CompleteOnboarding;

internal sealed class CompletePatientOnboarding : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(PatientsEndpoints.CompleteOnboarding, async (
                Request request,
                ClaimsPrincipal user,
                ICommandHandler<CompletePatientOnboardingCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Results.Unauthorized();
                }

                CompletePatientOnboardingCommand command = new CompletePatientOnboardingCommand(
                    Guid.Parse(userId),
                    request.DateOfBirth,
                    request.Gender,
                    request.PhoneNumber,
                    request.Address,
                    request.EmergencyContact);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.Patients);
    }

    private sealed record Request(
        string DateOfBirth,
        string Gender,
        string PhoneNumber,
        Address Address,
        EmergencyContact EmergencyContact);
}
