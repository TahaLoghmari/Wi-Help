using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Patients.Features.GetAllPatients;

internal sealed class GetAllPatients : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(PatientsEndpoints.GetAllPatients, async (
                [AsParameters] Request request,
                IQueryHandler<GetAllPatientsQuery, PaginationResultDto<GetAllPatientsDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetAllPatientsQuery(request.Page, request.PageSize);
                Result<PaginationResultDto<GetAllPatientsDto>> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Patients)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
