using Modules.Common.Features.Results;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.PublicApi;

public interface IProfessionalModuleApi
{
    Task<Result> CreateProfessionalAsync(
        CreateProfessionalRequest request,
        CancellationToken cancellationToken);
}