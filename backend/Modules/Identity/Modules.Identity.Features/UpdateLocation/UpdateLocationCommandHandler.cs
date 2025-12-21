using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Features.UpdateLocation;

/// <summary>
/// Handles the UpdateLocation command - validates and persists user location coordinates.
/// </summary>
public sealed class UpdateLocationCommandHandler(
    UserManager<User> userManager,
    ILogger<UpdateLocationCommandHandler> logger) : ICommandHandler<UpdateLocationCommand>
{
    public async Task<Result> Handle(UpdateLocationCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating location for user {UserId}", command.UserId);

        // Find the user
        var user = await userManager.FindByIdAsync(command.UserId);
        if (user is null)
        {
            logger.LogWarning("User not found for location update: {UserId}", command.UserId);
            return Result.Failure(IdentityErrors.UserNotFound(command.UserId));
        }

        // Create and validate coordinates
        var coordinates = Coordinates.Create(
            command.Latitude,
            command.Longitude,
            command.Accuracy,
            command.Timestamp);

        if (coordinates is null)
        {
            logger.LogWarning("Invalid coordinates provided for user {UserId}: lat={Lat}, lng={Lng}, acc={Acc}",
                command.UserId, command.Latitude, command.Longitude, command.Accuracy);
            return Result.Failure(Error.Validation("Location.InvalidCoordinates", 
                "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180, and accuracy must be non-negative."));
        }

        // Idempotency check: skip update if coordinates are identical
        if (user.Location is not null &&
            Math.Abs(user.Location.Latitude - coordinates.Latitude) < 0.000001 &&
            Math.Abs(user.Location.Longitude - coordinates.Longitude) < 0.000001 &&
            Math.Abs(user.Location.Accuracy - coordinates.Accuracy) < 0.01)
        {
            logger.LogInformation("Location unchanged for user {UserId}, skipping update", command.UserId);
            return Result.Success();
        }

        // Update user location
        user.UpdateLocation(coordinates);
        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            logger.LogError("Failed to update location for user {UserId}. Errors: {Errors}",
                command.UserId, string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            return Result.Failure(Error.Failure("Location.UpdateFailed", "Failed to update user location."));
        }

        logger.LogInformation("Location updated successfully for user {UserId}", command.UserId);
        return Result.Success();
    }
}
