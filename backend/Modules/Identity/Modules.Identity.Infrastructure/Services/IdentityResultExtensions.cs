using Microsoft.AspNetCore.Identity;
using Modules.Identity.Domain;

namespace Modules.Identity.Infrastructure.Services;

internal static class IdentityResultExtensions
{
    public static IdentityOperationResult ToOperationResult(this IdentityResult result) =>
        result.Succeeded
            ? IdentityOperationResult.Success()
            : IdentityOperationResult.Failure(result.Errors
                .Select(error => new IdentityOperationError(error.Code, error.Description))
                .ToList());
}
