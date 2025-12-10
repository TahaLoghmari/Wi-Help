using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

using Modules.Reports.Domain.Enums;

namespace Modules.Reports.Features.GetReportsForAdmin;

internal sealed class GetReportsForAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ReportsEndpoints.GetReportsForAdmin, async (
                [AsParameters] Request request,
                IQueryHandler<GetReportsForAdminQuery, PaginationResultDto<ReportAdminDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetReportsForAdminQuery(request.Page, request.PageSize, request.Type);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Reports)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request(int Page = 1, int PageSize = 10, ReportType? Type = null);
}
