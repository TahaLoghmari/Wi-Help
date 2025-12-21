using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.Services;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain;
using Modules.Identity.Infrastructure.Services;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Identity.Features;

public class IdentityModuleApi(
    UserManager<User> userManager,
    IdentityEmailService identityEmailService,
    SupabaseService supabaseService,
    ILogger<IdentityModuleApi> logger) : IIdentityModuleApi
{
    public async Task<Result<Guid>> CreateUserAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating user for email: {Email}", request.Email);

        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            logger.LogWarning("User creation failed - email already exists: {Email}", request.Email);
            return Result<Guid>.Failure(IdentityErrors.UserAlreadyExists());
        }

        User user = User.Create(
            request.FirstName,
            request.LastName,
            request.DateOfBirth,
            request.Gender,
            request.PhoneNumber,
            request.Email,
            request.Address);

        IdentityResult result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            logger.LogError("User creation failed for {Email}. Errors: {Errors}",
                request.Email,
                string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            return Result<Guid>.Failure(IdentityErrors.InvalidRegistrationInput());
        }

        logger.LogInformation("User created successfully for {Email}, UserId: {UserId}",
            request.Email, user.Id);

        await identityEmailService.SendConfirmationEmail(user);
        await userManager.AddToRoleAsync(user, request.Role);

        logger.LogInformation("Email confirmation sent and role assigned for UserId: {UserId}", user.Id);

        return Result<Guid>.Success(user.Id);
    }

    public async Task<Result<UserDto>> GetUserByIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving user by ID: {UserId}", userId);

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            logger.LogWarning("User not found for UserId: {UserId}", userId);
            return Result<UserDto>.Failure(Error.NotFound("IdentityApi.UserNotFound", $"User with ID '{userId}' not found."));
        }

        var userResponse = new UserDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.DateOfBirth.ToString("yyyy-MM-dd"),
            user.Gender,
            user.PhoneNumber!,
            user.Address,
            user.ProfilePictureUrl,
            user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow,
            user.Location);

        logger.LogInformation("User retrieved successfully for UserId: {UserId}", userId);

        return Result<UserDto>.Success(userResponse);
    }

    public async Task<Result> UpdateUserAsync(
        UpdateUserRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating user for UserId: {UserId}", request.UserId);

        var user = await userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null)
        {
            logger.LogWarning("User not found for update: {UserId}", request.UserId);
            return Result.Failure(Error.NotFound("IdentityApi.UserNotFound", $"User with ID '{request.UserId}' not found."));
        }

        if (!string.IsNullOrEmpty(request.ProfilePictureUrl) && !string.IsNullOrEmpty(user.ProfilePictureUrl))
        {
            await supabaseService.DeleteFileAsync(user.ProfilePictureUrl, "profile-pictures");
        }

        user.Update(
            request.FirstName,
            request.LastName,
            request.PhoneNumber,
            request.Address,
            string.IsNullOrWhiteSpace(request.ProfilePictureUrl) ? user.ProfilePictureUrl : request.ProfilePictureUrl);

        IdentityResult result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            logger.LogError("User update failed for {UserId}. Errors: {Errors}",
                request.UserId,
                string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            return Result.Failure(Error.Failure("IdentityApi.UpdateFailed", "Failed to update user."));
        }

        logger.LogInformation("User updated successfully for UserId: {UserId}", request.UserId);

        return Result.Success();
    }

    public async Task<Result<List<UserDto>>> GetUsersByIdsAsync(
        IEnumerable<Guid> userIds,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving users by IDs");

        var users = await userManager.Users
            .AsNoTracking()
            .Where(u => userIds.Contains(u.Id))
            .ToListAsync(cancellationToken);

        var userResponses = users.Select(user => new UserDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.DateOfBirth.ToString("yyyy-MM-dd"),
            user.Gender,
            user.PhoneNumber!,
            user.Address,
            user.ProfilePictureUrl,
            user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow,
            user.Location)).ToList();

        logger.LogInformation("Retrieved {Count} users", userResponses.Count);

        return Result<List<UserDto>>.Success(userResponses);
    }
    
    public async Task<Result> AddClaimAsync(
        Guid userId,
        string claimType,
        string claimValue,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Adding claim {ClaimType} to user {UserId}", claimType, userId);

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            logger.LogWarning("User not found for UserId: {UserId}", userId);
            return Result.Failure(Error.NotFound("IdentityApi.UserNotFound", $"User with ID '{userId}' not found."));
        }

        var result = await userManager.AddClaimAsync(user, new System.Security.Claims.Claim(claimType, claimValue));
        if (!result.Succeeded)
        {
            logger.LogError("Failed to add claim {ClaimType} to user {UserId}. Errors: {Errors}",
                claimType, userId, string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            return Result.Failure(Error.Failure("IdentityApi.AddClaimFailed", "Failed to add claim."));
        }

        logger.LogInformation("Claim {ClaimType} added successfully to user {UserId}", claimType, userId);
        return Result.Success();
    }
    
    public async Task<Result> BanUserAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Banning user {UserId}", userId);

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            logger.LogWarning("User not found for UserId: {UserId}", userId);
            return Result.Failure(Error.NotFound("IdentityApi.UserNotFound", $"User with ID '{userId}' not found."));
        }

        var result = await userManager.SetLockoutEnabledAsync(user, true);
        if (!result.Succeeded)
        {
            logger.LogError("Failed to enable lockout for user {UserId}", userId);
            return Result.Failure(Error.Failure("IdentityApi.BanFailed", "Failed to ban user."));
        }

        // Set lockout end date to far in the future (effectively permanent ban)
        var lockoutResult = await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
        if (!lockoutResult.Succeeded)
        {
            logger.LogError("Failed to set lockout date for user {UserId}", userId);
            return Result.Failure(Error.Failure("IdentityApi.BanFailed", "Failed to ban user."));
        }

        logger.LogInformation("User {UserId} banned successfully", userId);
        return Result.Success();
    }
    
    public async Task<Result> UnbanUserAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Unbanning user {UserId}", userId);

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            logger.LogWarning("User not found for UserId: {UserId}", userId);
            return Result.Failure(Error.NotFound("IdentityApi.UserNotFound", $"User with ID '{userId}' not found."));
        }

        var result = await userManager.SetLockoutEndDateAsync(user, null);
        if (!result.Succeeded)
        {
            logger.LogError("Failed to remove lockout for user {UserId}", userId);
            return Result.Failure(Error.Failure("IdentityApi.UnbanFailed", "Failed to unban user."));
        }

        logger.LogInformation("User {UserId} unbanned successfully", userId);
        return Result.Success();
    }
    
    public async Task<Result> ResetUserPasswordAsync(
        Guid userId,
        string newPassword,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Resetting password for user {UserId}", userId);

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            logger.LogWarning("User not found for UserId: {UserId}", userId);
            return Result.Failure(Error.NotFound("IdentityApi.UserNotFound", $"User with ID '{userId}' not found."));
        }

        // Remove current password
        var removeResult = await userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded)
        {
            logger.LogError("Failed to remove password for user {UserId}", userId);
            return Result.Failure(Error.Failure("IdentityApi.PasswordResetFailed", "Failed to reset password."));
        }

        // Add new password
        var addResult = await userManager.AddPasswordAsync(user, newPassword);
        if (!addResult.Succeeded)
        {
            logger.LogError("Failed to add new password for user {UserId}. Errors: {Errors}",
                userId, string.Join(", ", addResult.Errors.Select(e => $"{e.Code}: {e.Description}")));
            return Result.Failure(Error.Failure("IdentityApi.PasswordResetFailed", "Failed to reset password."));
        }

        logger.LogInformation("Password reset successfully for user {UserId}", userId);
        return Result.Success();
    }

    public async Task<Result<List<UserDto>>> GetUsersByRoleAsync(string role, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving users with role: {Role}", role);

        var users = await userManager.GetUsersInRoleAsync(role);
        
        var userDtos = users.Select(user => new UserDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.DateOfBirth.ToString("yyyy-MM-dd"),
            user.Gender,
            user.PhoneNumber!,
            user.Address,
            user.ProfilePictureUrl,
            user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow,
            user.Location
        )).ToList();

        logger.LogInformation("Retrieved {Count} users with role {Role}", userDtos.Count, role);

        return Result<List<UserDto>>.Success(userDtos);
    }
}

