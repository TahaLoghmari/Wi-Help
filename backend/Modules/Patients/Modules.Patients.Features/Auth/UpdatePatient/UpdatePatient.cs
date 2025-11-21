using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.Features.Auth.UpdatePatient;

internal sealed class UpdatePatient : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(PatientsEndpoints.UpdatePatient, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<UpdatePatientCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                UpdatePatientCommand command = new UpdatePatientCommand(
                    userId,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber,
                    request.Address,
                    request.EmergencyContact);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Patients)
            .RequireAuthorization();
    }

    private sealed record Request(
        string? FirstName,
        string? LastName,
        string? PhoneNumber,
        Address? Address,
        EmergencyContact? EmergencyContact);
}
