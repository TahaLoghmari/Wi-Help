namespace Modules.Common.Features.ValueObjects;
public record Address
{
    public string Street { get; } = string.Empty;
    public string City { get; } = string.Empty;
    public string PostalCode { get; } = string.Empty;
    public string Country { get; } = string.Empty;
    public double Latitude { get; } 
    public double Longitude { get; } 

    private Address() { }

    public Address(
        string street,
        string city,
        string postalCode,
        string country,
        double latitude,
        double longitude)
    {
        Street = street;
        City = city;
        PostalCode = postalCode;
        Country = country;
        Latitude = latitude;
        Longitude = longitude;
    }
}
