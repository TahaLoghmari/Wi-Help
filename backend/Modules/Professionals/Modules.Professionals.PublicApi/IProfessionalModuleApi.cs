using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.PublicApi;

public interface IProfessionalModuleApi
{
    Task<Result<ProfessionalDto>> GetProfessionalByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<Result<List<ProfessionalDto>>> GetProfessionalsByIdsAsync(IEnumerable<Guid> professionalIds, CancellationToken cancellationToken = default);
}