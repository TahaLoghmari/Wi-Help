namespace Modules.Patients.Domain.Entities;

public class Allergy
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;

    private Allergy() { }

    public Allergy(Guid id, string key)
    {
        Id = id;
        Key = key;
    }
}
