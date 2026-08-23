using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Ports;

namespace Modules.Identity.Infrastructure.Services;

public sealed class IdentityClaimOperations(UserManager<User> userManager) : IIdentityClaimOperations
{
    public async Task<IdentityOperationResult> AddClaimAsync(User user, Claim claim) =>
        (await userManager.AddClaimAsync(user, claim)).ToOperationResult();
}
