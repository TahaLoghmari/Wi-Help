namespace Modules.Common.Features.ValueObjects;

/// <summary>
/// Immutable value object representing geographic coordinates with accuracy and timestamp.
/// Used for storing user location data from browser geolocation API.
/// </summary>
public record Coordinates
{
    public double Latitude { get; }
    public double Longitude { get; }
    public double Accuracy { get; } // in meters
    public DateTime Timestamp { get; }

    private Coordinates() { }

    private Coordinates(double latitude, double longitude, double accuracy, DateTime timestamp)
    {
        Latitude = latitude;
        Longitude = longitude;
        Accuracy = accuracy;
        Timestamp = timestamp;
    }

    /// <summary>
    /// Creates validated Coordinates. Returns null if validation fails.
    /// </summary>
    public static Coordinates? Create(double latitude, double longitude, double accuracy, DateTime timestamp)
    {
        // Validate latitude range: -90 to 90
        if (latitude < -90 || latitude > 90)
            return null;

        // Validate longitude range: -180 to 180
        if (longitude < -180 || longitude > 180)
            return null;

        // Accuracy must be non-negative
        if (accuracy < 0)
            return null;

        return new Coordinates(latitude, longitude, accuracy, DateTime.SpecifyKind(timestamp, DateTimeKind.Utc));
    }

    /// <summary>
    /// Checks if coordinates are stale (older than specified duration).
    /// </summary>
    public bool IsStale(TimeSpan maxAge) => DateTime.UtcNow - Timestamp > maxAge;

    /// <summary>
    /// Calculates the distance to another set of coordinates in kilometers.
    /// </summary>
    public double DistanceTo(double targetLatitude, double targetLongitude)
    {
        const double EarthRadiusKm = 6371.0;
        var dLat = DegreesToRadians(targetLatitude - Latitude);
        var dLon = DegreesToRadians(targetLongitude - Longitude);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(Latitude)) * Math.Cos(DegreesToRadians(targetLatitude)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return EarthRadiusKm * c;
    }

    private static double DegreesToRadians(double degrees) => degrees * Math.PI / 180.0;
}
