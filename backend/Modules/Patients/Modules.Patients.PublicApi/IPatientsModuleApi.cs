using Modules.Common.Features.Results;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Patients.PublicApi;

public interface IPatientsModuleApi
{
    Task<Result> CreatePatientAsync(
        CreatePatientRequest request,
        CancellationToken cancellationToken);
}