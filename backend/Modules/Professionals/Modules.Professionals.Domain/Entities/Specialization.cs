namespace Modules.Professionals.Domain.Entities;

public class Specialization
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;
    public ICollection<Service> Services { get; private set; } = new List<Service>();

    private Specialization() { }

    public Specialization(Guid id, string key)
    {
        Id = id;
        Key = key;
    }
}
