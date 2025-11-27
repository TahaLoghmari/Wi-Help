using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

internal sealed class GetProfessionalAppointments : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetMyAppointments, async (
                [AsParameters] Request request,
                HttpContext httpContext,
                IQueryHandler<GetProfessionalAppointmentsQuery, PaginationResultDto<GetProfessionalAppointmentsDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ??
                                   httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetProfessionalAppointmentsQuery(userId, request.Page, request.PageSize);
                Result<PaginationResultDto<GetProfessionalAppointmentsDto>> result =
                    await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    private sealed record Request
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }

}