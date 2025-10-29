using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.Features;

public class ProfessionalModuleApi( 
    ProfessionalsDbContext dbContext,
    ILogger<ProfessionalModuleApi> logger): IProfessionalModuleApi
{
    public async Task<Result> CreateProfessionalAsync(
        CreateProfessionalRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating professional for UserId: {UserId}", request.UserId);

        var existingProfessional = await dbContext.Professionals
            .FirstOrDefaultAsync(p => p.UserId == request.UserId, cancellationToken);
        
        if (existingProfessional != null)
        {
            logger.LogWarning("Professional already exists for UserId: {UserId}", request.UserId);
            return Result.Failure(ProfessionalErrors.AlreadyExists(request.UserId));
        }

        var professional = new Professional(
            request.UserId,
            request.Specialization,
            request.YearsOfExperience,
            request.Address);
        
        dbContext.Professionals.Add(professional);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Professional created successfully for UserId: {UserId}, ProfessionalId: {ProfessionalId}",
            request.UserId, professional.Id);

        return Result.Success();
    }
}