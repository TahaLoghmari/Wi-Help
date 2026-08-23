using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Infrastructure.Database.Operations;

internal sealed class EducationOperations(ProfessionalsDbContext dbContext) : IEducationOperations
{
    public async Task<IReadOnlyList<Education>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.Educations.AsNoTracking().Where(education => education.ProfessionalId == professionalId)
            .OrderByDescending(education => education.StartYear).ToListAsync(cancellationToken);

    public Task<Education?> FindAsync(Guid educationId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Educations.FirstOrDefaultAsync(education => education.Id == educationId && education.ProfessionalId == professionalId, cancellationToken);

    public void Add(Education education) => dbContext.Educations.Add(education);
    public void Remove(Education education) => dbContext.Educations.Remove(education);
    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
