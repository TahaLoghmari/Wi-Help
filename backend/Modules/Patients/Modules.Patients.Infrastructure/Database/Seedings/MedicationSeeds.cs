using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Database.Seedings;

internal static class MedicationSeeds
{
    public static readonly Medication[] All =
    [
        new(new Guid("00000008-0000-0000-0000-000000000001"), "medications.lisinopril"),
        new(new Guid("00000008-0000-0000-0000-000000000002"), "medications.levothyroxine"),
        new(new Guid("00000008-0000-0000-0000-000000000003"), "medications.atorvastatin"),
        new(new Guid("00000008-0000-0000-0000-000000000004"), "medications.metformin"),
        new(new Guid("00000008-0000-0000-0000-000000000005"), "medications.simvastatin"),
        new(new Guid("00000008-0000-0000-0000-000000000006"), "medications.omeprazole"),
        new(new Guid("00000008-0000-0000-0000-000000000007"), "medications.amlodipine"),
        new(new Guid("00000008-0000-0000-0000-000000000008"), "medications.metoprolol"),
    ];
}
