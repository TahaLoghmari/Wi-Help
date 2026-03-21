namespace Modules.Patients.Domain.Entities;

public class Medication
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;

    private Medication() { }

    public Medication(Guid id, string key)
    {
        Id = id;
        Key = key;
    }
}
