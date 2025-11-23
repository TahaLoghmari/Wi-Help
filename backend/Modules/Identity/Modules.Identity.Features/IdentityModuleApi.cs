using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.Services;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Errors;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Identity.Features;

public class IdentityModuleApi(
    UserManager<User> userManager,
    EmailService emailService,
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
            return Result<Guid>.Failure(RegisterErrors.UserExists());
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
            return Result<Guid>.Failure(RegisterErrors.InvalidInput());
        }

        logger.LogInformation("User created successfully for {Email}, UserId: {UserId}",
            request.Email, user.Id);

        await emailService.SendConfirmationEmail(user);
        await userManager.AddToRoleAsync(user, request.Role);

        logger.LogInformation("Email confirmation sent and role assigned for UserId: {UserId}", user.Id);

        return Result<Guid>.Success(user.Id);
    }

    public async Task<Result<UserResponse>> GetUserByIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving user by ID: {UserId}", userId);

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            logger.LogWarning("User not found for UserId: {UserId}", userId);
            return Result<UserResponse>.Failure(Error.NotFound("IdentityApi.UserNotFound", $"User with ID '{userId}' not found."));
        }

        var userResponse = new UserResponse(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.DateOfBirth.ToString("yyyy-MM-dd"),
            user.Gender,
            user.PhoneNumber!,
            user.Address,
            user.ProfilePictureUrl);

        logger.LogInformation("User retrieved successfully for UserId: {UserId}", userId);

        return Result<UserResponse>.Success(userResponse);
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
}
