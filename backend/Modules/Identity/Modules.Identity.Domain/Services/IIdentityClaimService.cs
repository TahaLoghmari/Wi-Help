using System.Security.Claims;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Services;

public interface IIdentityClaimService
{
    Task<IdentityOperationResult> AddClaimAsync(User user, Claim claim);
}
