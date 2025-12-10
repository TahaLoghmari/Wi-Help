using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetAllPrescriptionsForAdmin;

internal sealed class GetAllPrescriptionsForAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetAllPrescriptionsForAdmin, async (
                [AsParameters] Request request,
                IQueryHandler<GetAllPrescriptionsForAdminQuery, PaginationResultDto<PrescriptionAdminDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetAllPrescriptionsForAdminQuery(request.Page, request.PageSize);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request(int Page = 1, int PageSize = 10);
}
