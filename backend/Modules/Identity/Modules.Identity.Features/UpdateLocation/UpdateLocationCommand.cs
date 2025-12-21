using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.UpdateLocation;

/// <summary>
/// Command for updating user location.
/// </summary>
public sealed record UpdateLocationCommand(
    string UserId,
    double Latitude,
    double Longitude,
    double Accuracy,
    DateTime Timestamp) : ICommand;
