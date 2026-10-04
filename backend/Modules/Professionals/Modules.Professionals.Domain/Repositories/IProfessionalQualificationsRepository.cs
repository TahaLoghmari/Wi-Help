using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Domain.Repositories;

public interface IProfessionalQualificationsRepository
{
    Task<IReadOnlyList<Award>> GetAwardsAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<Award?> FindAwardAsync(Guid awardId, Guid professionalId, CancellationToken cancellationToken);
    void Add(Award award);
    void Remove(Award award);
    Task<IReadOnlyList<Education>> GetEducationsAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<Education?> FindEducationAsync(Guid educationId, Guid professionalId, CancellationToken cancellationToken);
    void Add(Education education);
    void Remove(Education education);
    Task<IReadOnlyList<WorkExperience>> GetExperiencesAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<WorkExperience?> FindExperienceAsync(Guid experienceId, Guid professionalId, CancellationToken cancellationToken);
    void Add(WorkExperience workExperience);
    void Remove(WorkExperience workExperience);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
