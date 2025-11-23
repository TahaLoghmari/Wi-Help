using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Features.Auth.UpdatePatient;

internal sealed class UpdatePatient : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(PatientsEndpoints.UpdatePatient, async (
                [FromForm] Request request,
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
                    request.EmergencyContact,
                    request.MedicalInfo,
                    request.Bio,
                    request.ProfilePicture);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Patients)
            .DisableAntiforgery()
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Patient" });
    }

    private sealed class Request
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public Address? Address { get; set; }
        public EmergencyContact? EmergencyContact { get; set; }
        public MedicalInfo? MedicalInfo { get; set; }
        public string? Bio { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}
