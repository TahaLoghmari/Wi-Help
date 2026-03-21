namespace Modules.Identity.Domain.Entities;

public class State
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;
    public Guid CountryId { get; private set; }

    private State() { }

    public State(Guid id, string key, Guid countryId)
    {
        Id = id;
        Key = key;
        CountryId = countryId;
    }
}
