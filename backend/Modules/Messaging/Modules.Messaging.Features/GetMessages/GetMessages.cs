using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features.GetMessages;

public class GetMessages : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(MessagingEndpoints.GetMessages, async (
                Guid conversationId,
                int? pageNumber,
                int? pageSize,
                HttpContext httpContext,
                IQueryHandler<GetMessagesQuery, MessagesResponseDto> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value;
                if (!Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetMessagesQuery(
                    conversationId,
                    currentUserId,
                    pageNumber ?? 1,
                    pageSize ?? 50
                );

                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    messages => Results.Ok(messages),
                    CustomResults.Problem);
            })
            .WithTags("Messaging")
            .RequireAuthorization();
    }
}

