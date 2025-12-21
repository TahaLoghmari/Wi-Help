using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.DTOs;

namespace Modules.Identity.Features.Auth.GetCurrentUser;

public sealed class GetCurrentUserQueryHandler(
    UserManager<User> userManager,
    ILogger<GetCurrentUserQueryHandler> logger) : IQueryHandler<GetCurrentUserQuery, GetCurrentUserDto>
{
    public async Task<Result<GetCurrentUserDto>> Handle(
        GetCurrentUserQuery query,
        CancellationToken cancellationToken)
    {
        if (query.UserId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            return Result<GetCurrentUserDto>.Failure(Error.Unauthorized("GetCurrentUser.Unauthorized", "User ID claim is missing."));
        }

        var user = await userManager.FindByIdAsync(query.UserId);

        if (user is null)
        {
            logger.LogWarning("Get current user failed - user not found for UserId: {UserId}", query.UserId);
            return Result<GetCurrentUserDto>.Failure(Error.NotFound("GetCurrentUser.UserNotFound", $"No user found with ID '{query.UserId}'."));
        }

        logger.LogInformation("Current user retrieved successfully for UserId: {UserId}", query.UserId);

        var userRoles = await userManager.GetRolesAsync(user);

        var userDto = new GetCurrentUserDto(
            user.Id,
            user.FirstName,
            user.LastName,
            user.DateOfBirth.ToString("yyyy-MM-dd"),
            user.Gender,
            user.PhoneNumber!,
            user.Email!,
            user.Address,
            userRoles.FirstOrDefault() ?? string.Empty,
            user.ProfilePictureUrl,
            user.Location);

        return Result<GetCurrentUserDto>.Success(userDto);
    }
}