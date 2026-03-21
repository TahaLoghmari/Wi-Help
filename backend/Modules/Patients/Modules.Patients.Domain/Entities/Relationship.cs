namespace Modules.Patients.Domain.Entities;

public class Relationship
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;

    private Relationship() { }

    public Relationship(Guid id, string key)
    {
        Id = id;
        Key = key;
    }
}
