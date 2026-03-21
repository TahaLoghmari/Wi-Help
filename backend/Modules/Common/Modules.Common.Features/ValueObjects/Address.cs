namespace Modules.Common.Features.ValueObjects;
public record Address
{
    public string Street { get; } = string.Empty;
    public string City { get; } = string.Empty;
    public string PostalCode { get; } = string.Empty;
    public Guid CountryId { get; }
    public Guid StateId { get; }

    private Address() { }

    public Address(
        string street,
        string city,
        string postalCode,
        Guid countryId,
        Guid stateId)
    {
        Street = street;
        City = city;
        PostalCode = postalCode;
        CountryId = countryId;
        StateId = stateId;
    }
}
