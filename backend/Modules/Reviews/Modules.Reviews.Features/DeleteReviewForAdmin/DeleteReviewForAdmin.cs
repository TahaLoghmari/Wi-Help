using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.DeleteReviewForAdmin;

public class DeleteReviewForAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ReviewsEndpoints.DeleteReviewForAdmin, async (
                Guid reviewId,
                ICommandHandler<DeleteReviewForAdminCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new DeleteReviewForAdminCommand(reviewId);
                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }
}
