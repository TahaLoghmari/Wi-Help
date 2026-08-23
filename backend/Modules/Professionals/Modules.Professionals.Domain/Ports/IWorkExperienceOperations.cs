using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Domain.Ports;

public interface IWorkExperienceOperations
{
    Task<IReadOnlyList<WorkExperience>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<WorkExperience?> FindAsync(Guid experienceId, Guid professionalId, CancellationToken cancellationToken);
    void Add(WorkExperience workExperience);
    void Remove(WorkExperience workExperience);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
