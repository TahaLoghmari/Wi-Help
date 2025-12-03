using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetPatientProfessionals;

internal sealed class GetPatientProfessionals : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetMyProfessionals, async (
                [AsParameters] Request request,
                HttpContext httpContext,
                IQueryHandler<GetPatientProfessionalsQuery, PaginationResultDto<ProfessionalDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var patientIdString = httpContext.User.FindFirst("PatientId")?.Value;

                if (string.IsNullOrEmpty(patientIdString) || !Guid.TryParse(patientIdString, out var patientId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetPatientProfessionalsQuery(patientId, request.Page, request.PageSize);
                Result<PaginationResultDto<ProfessionalDto>> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Patient" });
    }

    private sealed record Request
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
