using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.PublicApi;

public interface IProfessionalModuleApi
{
    Task<Result<ProfessionalDto>> GetProfessionalByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<Result<List<ProfessionalDto>>> GetProfessionalsByIdsAsync(IEnumerable<Guid> professionalIds, CancellationToken cancellationToken = default);
    
    Task<Result<PaginationResultDto<ProfessionalAdminDto>>> GetAllProfessionalsForAdminAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    
    Task<Result> UpdateVerificationStatusAsync(Guid professionalId, Modules.Professionals.Domain.Enums.VerificationStatus verificationStatus, CancellationToken cancellationToken = default);
}