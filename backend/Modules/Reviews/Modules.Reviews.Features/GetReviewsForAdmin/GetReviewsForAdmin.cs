using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Reviews.Features.GetReviewsForAdmin;

internal sealed class GetReviewsForAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ReviewsEndpoints.GetReviewsForAdmin, async (
                [AsParameters] Request request,
                IQueryHandler<GetReviewsForAdminQuery, PaginationResultDto<ReviewAdminDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetReviewsForAdminQuery(request.Page, request.PageSize);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request(int Page = 1, int PageSize = 10);
}
