using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.Domain.Entities;

public class Patient
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }

    public Address Address { get; private set; }
    public EmergencyContact? EmergencyContact { get; private set; }

    public Patient (
        Guid userId,
        Address defaultAddress,
        EmergencyContact contact)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Address = defaultAddress;
        EmergencyContact = contact;

    }
}
