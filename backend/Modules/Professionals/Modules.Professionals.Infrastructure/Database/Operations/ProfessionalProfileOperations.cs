using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Infrastructure.Database.Operations;

internal sealed class ProfessionalProfileOperations(ProfessionalsDbContext dbContext) : IProfessionalProfileOperations
{
    public Task<Professional?> FindByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Professionals.FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

    public Task<Professional?> FindByIdAsync(Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Professionals.FirstOrDefaultAsync(p => p.Id == professionalId, cancellationToken);

    public Task<Professional?> FindByUserIdReadOnlyAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Professionals.AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

    public Task<Professional?> FindByIdReadOnlyAsync(Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Professionals.AsNoTracking().FirstOrDefaultAsync(p => p.Id == professionalId, cancellationToken);

    public Task<Professional?> FindByUserIdWithDetailsAsync(Guid userId, CancellationToken cancellationToken) =>
        Details().FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

    public Task<Professional?> FindByUserIdWithDetailsReadOnlyAsync(Guid userId, CancellationToken cancellationToken) =>
        Details().AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

    public Task<Professional?> FindByIdWithDetailsAsync(Guid professionalId, CancellationToken cancellationToken) =>
        Details().FirstOrDefaultAsync(p => p.Id == professionalId, cancellationToken);

    public async Task<IReadOnlyList<Professional>> GetByIdsWithDetailsAsync(IEnumerable<Guid> professionalIds, CancellationToken cancellationToken) =>
        await Details().AsNoTracking().Where(p => professionalIds.Contains(p.Id)).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Professional>> GetAllWithDetailsAsync(decimal? maxPrice, CancellationToken cancellationToken)
    {
        var professionals = Details().AsNoTracking();
        if (maxPrice.HasValue)
        {
            professionals = professionals.Where(p => p.VisitPrice <= maxPrice.Value);
        }

        return await professionals.ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Professional>> GetAdminPageAsync(int page, int pageSize, CancellationToken cancellationToken) =>
        await dbContext.Professionals.Include(p => p.Specialization)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Professional>> GetPublicApiAdminPageAsync(int page, int pageSize, CancellationToken cancellationToken) =>
        await dbContext.Professionals.Include(p => p.Specialization).AsNoTracking().OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Professional>> GetVerificationPageAsync(int page, int pageSize, CancellationToken cancellationToken) =>
        await dbContext.Professionals.Include(p => p.VerificationDocuments).OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

    public Task<int> CountAsync(CancellationToken cancellationToken) => dbContext.Professionals.CountAsync(cancellationToken);

    public void Add(Professional professional) => dbContext.Professionals.Add(professional);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);

    private IQueryable<Professional> Details() => dbContext.Professionals
        .Include(p => p.Specialization)
        .Include(p => p.Services);
}
