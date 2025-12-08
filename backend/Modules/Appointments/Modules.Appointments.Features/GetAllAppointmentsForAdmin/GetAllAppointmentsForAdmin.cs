using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetAllAppointmentsForAdmin;

internal sealed class GetAllAppointmentsForAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetAllAppointmentsForAdmin, async (
                [AsParameters] Request request,
                IQueryHandler<GetAllAppointmentsForAdminQuery, PaginationResultDto<GetAllAppointmentsForAdminDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetAllAppointmentsForAdminQuery(request.Page, request.PageSize);
                Result<PaginationResultDto<GetAllAppointmentsForAdminDto>> result =
                    await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    private sealed record Request
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
