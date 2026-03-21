using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Infrastructure.Database;

public static class ProfessionalDataSeeder
{
    public static async Task<Dictionary<Guid, Guid>> SeedProfessionalsAsync(ProfessionalsDbContext dbContext, IEnumerable<(Guid UserId, Guid SpecializationId, int Experience)> professionalsData)
    {
        var result = new Dictionary<Guid, Guid>();
        foreach (var (userId, specializationId, experience) in professionalsData)
        {
            var existingProfessional = await dbContext.Professionals.FirstOrDefaultAsync(p => p.UserId == userId);
            if (existingProfessional != null)
            {
                result[userId] = existingProfessional.Id;
                continue;
            }

            var professional = new Professional(userId, specializationId, experience);
            dbContext.Professionals.Add(professional);
            result[userId] = professional.Id;
        }

        await dbContext.SaveChangesAsync();
        return result;
    }
}