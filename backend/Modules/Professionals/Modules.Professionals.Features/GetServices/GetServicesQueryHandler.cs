using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.GetServices;

public sealed class GetServicesQueryHandler(
    IProfessionalCatalogOperations catalogOperations,
    ILogger<GetServicesQueryHandler> logger) : IQueryHandler<GetServicesQuery, List<ServiceDto>>
{
    public async Task<Result<List<ServiceDto>>> Handle(
        GetServicesQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving services for SpecializationId: {SpecializationId}", query.SpecializationId);

        var services = (await catalogOperations.GetServicesAsync(query.SpecializationId, cancellationToken))
            .Select(s => new ServiceDto(s.Id, s.Key))
            .ToList();

        logger.LogInformation("Retrieved {Count} services for SpecializationId: {SpecializationId}", services.Count, query.SpecializationId);

        return Result<List<ServiceDto>>.Success(services);
    }
}
