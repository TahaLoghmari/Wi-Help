using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Infrastructure.Database.Operations;

internal sealed class ProfessionalCatalogOperations(ProfessionalsDbContext dbContext) : IProfessionalCatalogOperations
{
    public Task<Specialization?> FindSpecializationAsync(Guid specializationId, CancellationToken cancellationToken) =>
        dbContext.Specializations.AsNoTracking().FirstOrDefaultAsync(s => s.Id == specializationId, cancellationToken);

    public async Task<IReadOnlyList<Specialization>> GetSpecializationsAsync(CancellationToken cancellationToken) =>
        await dbContext.Specializations.AsNoTracking().OrderBy(s => s.Key).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Service>> GetServicesAsync(Guid specializationId, CancellationToken cancellationToken) =>
        await dbContext.Specializations.AsNoTracking().Where(s => s.Id == specializationId)
            .SelectMany(s => s.Services).OrderBy(s => s.Key).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Service>> GetServicesByIdsAsync(IEnumerable<Guid> serviceIds, CancellationToken cancellationToken) =>
        await dbContext.Services.Where(s => serviceIds.Contains(s.Id)).ToListAsync(cancellationToken);
}
