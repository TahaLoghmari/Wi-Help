namespace Modules.Identity.Domain.Entities;

public class Country
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;

    private Country() { }

    public Country(Guid id, string key)
    {
        Id = id;
        Key = key;
    }
}
