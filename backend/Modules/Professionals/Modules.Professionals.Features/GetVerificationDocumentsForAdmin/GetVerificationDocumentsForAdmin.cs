using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetVerificationDocumentsForAdmin;

internal sealed class GetVerificationDocumentsForAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetVerificationDocumentsForAdmin, async (
                [AsParameters] Request request,
                IQueryHandler<GetVerificationDocumentsForAdminQuery, PaginationResultDto<ProfessionalVerificationDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetVerificationDocumentsForAdminQuery(request.Page, request.PageSize);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request(int Page = 1, int PageSize = 10);
}
