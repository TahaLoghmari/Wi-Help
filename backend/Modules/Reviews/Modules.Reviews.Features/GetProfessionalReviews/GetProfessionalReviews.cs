using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Reviews.Features.GetProfessionalReviews;

internal sealed class GetProfessionalReviews : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ReviewsEndpoints.GetProfessionalReviews, async (
                Guid professionalId,
                [AsParameters] Request request,
                HttpContext httpContext,
                IQueryHandler<GetProfessionalReviewsQuery, PaginationResultDto<GetProfessionalReviewsDto>> handler,
                CancellationToken cancellationToken) =>
            {
                Guid? currentUserId = null;
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value ??
                                         httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrWhiteSpace(currentUserIdString) && Guid.TryParse(currentUserIdString, out Guid parsedUserId))
                {
                    currentUserId = parsedUserId;
                }

                var query = new GetProfessionalReviewsQuery(professionalId, request.Page, request.PageSize, currentUserId);
                Result<PaginationResultDto<GetProfessionalReviewsDto>> result =
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

