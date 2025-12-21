using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.ValueObjects;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Database;

public static class PatientDataSeeder
{
    public static async Task<Dictionary<Guid, Guid>> SeedPatientsAsync(PatientsDbContext dbContext, IEnumerable<(Guid UserId, EmergencyContact EmergencyContact)> patientsData)
    {
        var result = new Dictionary<Guid, Guid>();
        foreach (var (userId, emergencyContact) in patientsData)
        {
            var existingPatient = await dbContext.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (existingPatient != null)
            {
                result[userId] = existingPatient.Id;
                continue;
            }

            var patient = new Patient(userId, emergencyContact);
            dbContext.Patients.Add(patient);
            result[userId] = patient.Id;
        }

        await dbContext.SaveChangesAsync();
        return result;
    }
}