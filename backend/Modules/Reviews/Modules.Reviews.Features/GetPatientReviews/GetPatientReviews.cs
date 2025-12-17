using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Reviews.Features.GetPatientReviews;

internal sealed class GetPatientReviews : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ReviewsEndpoints.GetPatientReviews, async (
                Guid patientId,
                [AsParameters] Request request,
                HttpContext httpContext,
                IQueryHandler<GetPatientReviewsQuery, PaginationResultDto<GetPatientReviewsDto>> handler,
                CancellationToken cancellationToken) =>
            {
                Guid? currentUserId = null;
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value ??
                                         httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrWhiteSpace(currentUserIdString) && Guid.TryParse(currentUserIdString, out Guid parsedUserId))
                {
                    currentUserId = parsedUserId;
                }

                var query = new GetPatientReviewsQuery(patientId, request.Page, request.PageSize, currentUserId);
                Result<PaginationResultDto<GetPatientReviewsDto>> result =
                    await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }

    private sealed record Request
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
