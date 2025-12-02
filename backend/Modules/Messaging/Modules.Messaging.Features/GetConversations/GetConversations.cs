using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
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
                ILogger<GetConversations> logger,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value ?? 
                                         httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(currentUserIdString) || !Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    logger.LogWarning("Failed to extract user ID from claims for GetConversations endpoint");
                    return Results.Unauthorized();
                }

                logger.LogInformation("Fetching conversations for user {UserId}", currentUserId);

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

