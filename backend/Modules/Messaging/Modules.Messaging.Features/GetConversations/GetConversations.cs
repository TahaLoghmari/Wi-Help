using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features.GetConversations;

public class GetConversations : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(MessagingEndpoints.GetConversations, async (
                HttpContext httpContext,
                IQueryHandler<GetConversationsQuery, List<ConversationDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value;
                if (!Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetConversationsQuery(currentUserId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    conversations => Results.Ok(conversations),
                    CustomResults.Problem);
            })
            .WithTags("Messaging")
            .RequireAuthorization();
    }
}

