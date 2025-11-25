

using Modules.Common.Features.Results;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Patients.PublicApi;

public interface IPatientsModuleApi
{
    Task<Result<List<PatientDto>>> GetPatientsByIdsAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken = default);
    Task<Result<PatientDto>> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
