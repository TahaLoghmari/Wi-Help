using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalPatients;

internal sealed class GetProfessionalPatients : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetMyPatients, async (
                [AsParameters] Request request,
                HttpContext httpContext,
                IQueryHandler<GetProfessionalPatientsQuery, PaginationResultDto<PatientDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (string.IsNullOrEmpty(professionalIdString) || !Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetProfessionalPatientsQuery(professionalId, request.Page, request.PageSize);
                Result<PaginationResultDto<PatientDto>> result = await handler.Handle(query, cancellationToken);

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
