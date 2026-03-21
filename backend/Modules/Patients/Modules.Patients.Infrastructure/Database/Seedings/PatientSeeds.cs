using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Infrastructure.Database.Seedings;

public static class PatientSeeds
{
    private static readonly Guid FriendRelationship = new("00000005-0000-0000-0000-000000000009");

    /// <summary>
    /// Seed data for demo patients. Each entry maps 1:1 with PatientUserSeeds.All.
    /// </summary>
    public static readonly EmergencyContact[] All =
    [
        new("Sami Ben Youssef", "+216 98 442 109", FriendRelationship),
        new("Yassine Karray",   "+216 97 560 882", FriendRelationship),
    ];
}
