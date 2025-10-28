using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Domain.Entities;

public class Patient
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }

    public Address? DefaultAddress { get; private set; }
    public EmergencyContact? EmergencyContact { get; private set; }
    

    private Patient() { } 

    public static Patient Create(
        Guid userId,
        Address defaultAddress,
        EmergencyContact contact)
    {
        return new Patient
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DefaultAddress = defaultAddress,
            EmergencyContact = contact
        };
    }
}
