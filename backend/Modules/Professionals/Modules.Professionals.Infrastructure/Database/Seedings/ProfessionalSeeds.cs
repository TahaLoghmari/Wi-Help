namespace Modules.Professionals.Infrastructure.Database.Seedings;

public static class ProfessionalSeeds
{
    /// <summary>
    /// Seed data for demo professionals. Each entry maps 1:1 with ProfessionalUserSeeds.All.
    /// (SpecializationId, Experience in years)
    /// </summary>
    public static readonly (Guid SpecializationId, int Experience)[] All =
    [
        (new Guid("00000004-0000-0000-0000-000000000013"), 11), // criticalCare
        (new Guid("00000004-0000-0000-0000-000000000013"),  7), // criticalCare
    ];
}
