using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Features.UpdateDocumentStatus;

internal sealed class UpdateDocumentStatus : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ProfessionalsEndpoints.UpdateDocumentStatus, async (
                Guid documentId,
                UpdateDocumentStatusRequest request,
                ICommandHandler<UpdateDocumentStatusCommand> handler,
                CancellationToken cancellationToken) =>
            {
                if (!Enum.TryParse<DocumentStatus>(request.Status, true, out var status))
                {
                    return Results.BadRequest("Invalid status");
                }

                var command = new UpdateDocumentStatusCommand(documentId, status);
                var result = await handler.Handle(command, cancellationToken);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }
}

public sealed record UpdateDocumentStatusRequest(string Status);
