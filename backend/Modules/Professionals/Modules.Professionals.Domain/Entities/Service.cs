namespace Modules.Professionals.Domain.Entities;

public class Service
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;

    private Service() { }

    public Service(Guid id, string key)
    {
        Id = id;
        Key = key;
    }
}
