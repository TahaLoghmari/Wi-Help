using System.Security.Claims;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Ports;

public interface IIdentityClaimOperations
{
    Task<IdentityOperationResult> AddClaimAsync(User user, Claim claim);
}
