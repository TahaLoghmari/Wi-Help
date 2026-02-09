using Microsoft.AspNetCore.Identity;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Infrastructure.Validators;

/// <summary>
/// Custom user validator that allows duplicate usernames.
/// Performs all default validations (username format, email uniqueness)
/// except for username uniqueness.
/// </summary>
public sealed class CustomUserValidator : IUserValidator<User>
{
    public CustomUserValidator(IdentityErrorDescriber? errors = null)
    {
        Describer = errors ?? new IdentityErrorDescriber();
    }

    private IdentityErrorDescriber Describer { get; }

    public async Task<IdentityResult> ValidateAsync(UserManager<User> manager, User user)
    {
        ArgumentNullException.ThrowIfNull(manager);
        ArgumentNullException.ThrowIfNull(user);

        var errors = new List<IdentityError>();

        await ValidateUserName(manager, user, errors);

        if (manager.Options.User.RequireUniqueEmail)
        {
            await ValidateEmail(manager, user, errors);
        }

        return errors.Count > 0 ? IdentityResult.Failed(errors.ToArray()) : IdentityResult.Success;
    }

    private async Task ValidateUserName(UserManager<User> manager, User user, List<IdentityError> errors)
    {
        var userName = await manager.GetUserNameAsync(user);

        if (string.IsNullOrWhiteSpace(userName))
        {
            errors.Add(Describer.InvalidUserName(userName));
            return;
        }

        if (!string.IsNullOrEmpty(manager.Options.User.AllowedUserNameCharacters) &&
            userName.Any(c => !manager.Options.User.AllowedUserNameCharacters.Contains(c)))
        {
            errors.Add(Describer.InvalidUserName(userName));
        }

        // NOTE: Uniqueness check intentionally removed to allow duplicate usernames
    }

    private static async Task ValidateEmail(UserManager<User> manager, User user, List<IdentityError> errors)
    {
        var email = await manager.GetEmailAsync(user);

        if (string.IsNullOrWhiteSpace(email))
        {
            errors.Add(new IdentityErrorDescriber().InvalidEmail(email));
            return;
        }

        var existingUser = await manager.FindByEmailAsync(email);

        if (existingUser != null &&
            !string.Equals(await manager.GetUserIdAsync(existingUser), await manager.GetUserIdAsync(user)))
        {
            errors.Add(new IdentityErrorDescriber().DuplicateEmail(email));
        }
    }
}
