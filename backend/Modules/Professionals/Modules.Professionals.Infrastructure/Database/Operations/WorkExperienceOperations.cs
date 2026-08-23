using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Infrastructure.Database.Operations;

internal sealed class WorkExperienceOperations(ProfessionalsDbContext dbContext) : IWorkExperienceOperations
{
    public async Task<IReadOnlyList<WorkExperience>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.WorkExperiences.AsNoTracking().Where(experience => experience.ProfessionalId == professionalId)
            .OrderByDescending(experience => experience.IsCurrentPosition).ThenByDescending(experience => experience.StartYear).ToListAsync(cancellationToken);

    public Task<WorkExperience?> FindAsync(Guid experienceId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.WorkExperiences.FirstOrDefaultAsync(experience => experience.Id == experienceId && experience.ProfessionalId == professionalId, cancellationToken);

    public void Add(WorkExperience workExperience) => dbContext.WorkExperiences.Add(workExperience);
    public void Remove(WorkExperience workExperience) => dbContext.WorkExperiences.Remove(workExperience);
    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
