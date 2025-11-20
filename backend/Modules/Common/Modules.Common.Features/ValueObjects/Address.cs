namespace Modules.Common.Features.ValueObjects;
public record Address
{
    public string Street { get; } = string.Empty;
    public string City { get; } = string.Empty;
    public string PostalCode { get; } = string.Empty;
    public string Country { get; } = string.Empty;
    public string State { get; } = string.Empty;

    private Address() { }

    public Address(
        string street,
        string city,
        string postalCode,
        string country,
        string state)
    {
        Street = street;
        City = city;
        PostalCode = postalCode;
        Country = country;
        State = state;
    }
}
