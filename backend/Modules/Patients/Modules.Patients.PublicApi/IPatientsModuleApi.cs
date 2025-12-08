

using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Patients.PublicApi;

public interface IPatientsModuleApi
{
    Task<Result<List<PatientDto>>> GetPatientsByIdsAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken = default);
    Task<Result<PatientDto>> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Result<PaginationResultDto<PatientAdminDto>>> GetAllPatientsForAdminAsync(int page, int pageSize, CancellationToken cancellationToken = default);
}
