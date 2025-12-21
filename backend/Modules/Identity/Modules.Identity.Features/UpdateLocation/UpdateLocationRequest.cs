namespace Modules.Identity.Features.UpdateLocation;

/// <summary>
/// Request DTO for updating user location coordinates.
/// </summary>
public sealed record UpdateLocationRequest(
    double Latitude,
    double Longitude,
    double Accuracy,
    DateTime Timestamp);
