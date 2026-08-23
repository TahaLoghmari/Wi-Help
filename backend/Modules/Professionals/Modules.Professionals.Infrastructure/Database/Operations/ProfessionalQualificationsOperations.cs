using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Infrastructure.Database.Operations;

internal sealed class ProfessionalQualificationsOperations(ProfessionalsDbContext dbContext) : IProfessionalQualificationsOperations
{
    public async Task<IReadOnlyList<Award>> GetAwardsAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.Awards.AsNoTracking().Where(award => award.ProfessionalId == professionalId)
            .OrderByDescending(award => award.YearReceived).ToListAsync(cancellationToken);

    public Task<Award?> FindAwardAsync(Guid awardId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Awards.FirstOrDefaultAsync(award => award.Id == awardId && award.ProfessionalId == professionalId, cancellationToken);

    public void Add(Award award) => dbContext.Awards.Add(award);
    public void Remove(Award award) => dbContext.Awards.Remove(award);

    public async Task<IReadOnlyList<Education>> GetEducationsAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.Educations.AsNoTracking().Where(education => education.ProfessionalId == professionalId)
            .OrderByDescending(education => education.StartYear).ToListAsync(cancellationToken);

    public Task<Education?> FindEducationAsync(Guid educationId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.Educations.FirstOrDefaultAsync(education => education.Id == educationId && education.ProfessionalId == professionalId, cancellationToken);

    public void Add(Education education) => dbContext.Educations.Add(education);
    public void Remove(Education education) => dbContext.Educations.Remove(education);

    public async Task<IReadOnlyList<WorkExperience>> GetExperiencesAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.WorkExperiences.AsNoTracking().Where(experience => experience.ProfessionalId == professionalId)
            .OrderByDescending(experience => experience.IsCurrentPosition).ThenByDescending(experience => experience.StartYear).ToListAsync(cancellationToken);

    public Task<WorkExperience?> FindExperienceAsync(Guid experienceId, Guid professionalId, CancellationToken cancellationToken) =>
        dbContext.WorkExperiences.FirstOrDefaultAsync(experience => experience.Id == experienceId && experience.ProfessionalId == professionalId, cancellationToken);

    public void Add(WorkExperience workExperience) => dbContext.WorkExperiences.Add(workExperience);
    public void Remove(WorkExperience workExperience) => dbContext.WorkExperiences.Remove(workExperience);
    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
