using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.GetServices;

public sealed class GetServicesQueryHandler(
    ProfessionalsDbContext dbContext,
    ILogger<GetServicesQueryHandler> logger) : IQueryHandler<GetServicesQuery, List<ServiceDto>>
{
    public async Task<Result<List<ServiceDto>>> Handle(
        GetServicesQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving services for SpecializationId: {SpecializationId}", query.SpecializationId);

        var services = await dbContext.Specializations
            .AsNoTracking()
            .Where(s => s.Id == query.SpecializationId)
            .SelectMany(s => s.Services)
            .OrderBy(s => s.Key)
            .Select(s => new ServiceDto(s.Id, s.Key))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} services for SpecializationId: {SpecializationId}", services.Count, query.SpecializationId);

        return Result<List<ServiceDto>>.Success(services);
    }
}
