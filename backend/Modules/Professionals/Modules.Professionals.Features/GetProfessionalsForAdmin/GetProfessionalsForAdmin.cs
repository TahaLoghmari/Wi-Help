using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionalsForAdmin;

internal sealed class GetProfessionalsForAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetProfessionalsForAdmin, async (
                [AsParameters] Request request,
                IQueryHandler<GetProfessionalsForAdminQuery, PaginationResultDto<GetProfessionalsForAdminDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetProfessionalsForAdminQuery(request.Page, request.PageSize);
                Result<PaginationResultDto<GetProfessionalsForAdminDto>> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
