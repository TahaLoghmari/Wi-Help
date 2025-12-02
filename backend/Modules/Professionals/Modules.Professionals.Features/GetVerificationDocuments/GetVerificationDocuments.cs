using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.GetVerificationDocuments;

internal sealed class GetVerificationDocuments : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetVerificationDocuments, async (
                HttpContext httpContext,
                IQueryHandler<GetVerificationDocumentsQuery, List<VerificationDocumentDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value 
                    ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetVerificationDocumentsQuery(userId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    documents => Results.Ok(documents),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}
