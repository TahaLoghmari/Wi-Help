using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Infrastructure.Database.Operations;

internal sealed class AwardOperations(ProfessionalsDbContext dbContext) : IAwardOperations
{
    public async Task<IReadOnlyList<Award>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.Awards.AsNoTracking().Where(award => award.ProfessionalId == professionalId)
            .OrderByDescending(award => award.YearReceived).ToListAsync(cancellationToken);

    public Task<Award?> FindAsync(Guid awardId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Awards.FirstOrDefaultAsync(award => award.Id == awardId && award.ProfessionalId == professionalId, cancellationToken);

    public void Add(Award award) => dbContext.Awards.Add(award);
    public void Remove(Award award) => dbContext.Awards.Remove(award);
    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
