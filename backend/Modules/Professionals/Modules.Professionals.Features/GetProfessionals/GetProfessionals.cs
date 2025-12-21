using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Professionals.Features.GetProfessional;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionals;

internal sealed class GetProfessionals : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetAllProfessionals, async (
                [AsParameters] Request request,
                IQueryHandler<GetProfessionalsQuery, PaginationResultDto<GetProfessionalDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetProfessionalsQuery(
                    request.Search,
                    request.Location,
                    request.MaxPrice,
                    request.Availability,
                    request.Page,
                    request.PageSize,
                    request.UserLatitude,
                    request.UserLongitude,
                    request.MaxDistanceKm);
                Result<PaginationResultDto<GetProfessionalDto>> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals);
    }
    public sealed record Request
    {
        public string? Search { get; init; }
        public string? Location { get; init; }
        public decimal? MaxPrice { get; init; }
        public string? Availability { get; init; }
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
        public double? UserLatitude { get; init; }
        public double? UserLongitude { get; init; }
        public double? MaxDistanceKm { get; init; }
    }
}
