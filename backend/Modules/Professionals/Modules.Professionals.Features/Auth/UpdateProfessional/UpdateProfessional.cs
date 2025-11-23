using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.UpdateProfessional;

internal sealed class UpdateProfessional : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ProfessionalsEndpoints.UpdateProfessional, async (
                [FromForm] Request request,
                HttpContext httpContext,
                ICommandHandler<UpdateProfessionalCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                UpdateProfessionalCommand command = new UpdateProfessionalCommand(
                    userId,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber,
                    request.Address,
                    request.Specialization,
                    request.Services,
                    request.Experience,
                    request.StartPrice,
                    request.EndPrice,
                    request.Bio,
                    request.ProfilePicture);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .DisableAntiforgery()
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    public sealed class Request
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public Address? Address { get; set; }
        public string? Specialization { get; set; }
        public List<string>? Services { get; set; }
        public int? Experience { get; set; }
        public int? StartPrice { get; set; }
        public int? EndPrice { get; set; }
        public string? Bio { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}
