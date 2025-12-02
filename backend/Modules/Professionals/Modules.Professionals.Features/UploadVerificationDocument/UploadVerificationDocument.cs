using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Features.UploadVerificationDocument;

internal sealed class UploadVerificationDocument : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.UploadVerificationDocument, async (
                [FromForm] Request request,
                HttpContext httpContext,
                ICommandHandler<UploadVerificationDocumentCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value 
                    ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                var command = new UploadVerificationDocumentCommand(
                    userId,
                    request.DocumentType,
                    request.Document);

                var result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .DisableAntiforgery()
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    public sealed class Request
    {
        public DocumentType DocumentType { get; set; }
        public IFormFile Document { get; set; } = null!;
    }
}
