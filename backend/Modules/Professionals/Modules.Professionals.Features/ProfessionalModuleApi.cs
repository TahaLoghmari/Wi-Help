using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.Features;

public class ProfessionalModuleApi(
    ProfessionalsDbContext professionalsDbContext, 
    IIdentityModuleApi identityApi,
    ILogger<ProfessionalModuleApi> logger)
    : IProfessionalModuleApi
{
    public async Task<Result<ProfessionalDto>> GetProfessionalByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var professional = await professionalsDbContext.Professionals
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (professional is null)
        {
            return Result<ProfessionalDto>.Failure(ProfessionalErrors.NotFound(userId));
        }

        var userResult = await identityApi.GetUserByIdAsync(userId, cancellationToken);
        if (userResult.IsFailure)
        {
             return Result<ProfessionalDto>.Failure(userResult.Error);
        }
        
        var user = userResult.Value;

        return Result<ProfessionalDto>.Success(new ProfessionalDto(
            professional.Id, 
            professional.UserId,
            user.FirstName,
            user.LastName,
            user.Email,
            user.PhoneNumber,
            user.DateOfBirth,
            user.Gender,
            user.Address,
            professional.Specialization,
            professional.Services,
            professional.Experience,
            professional.StartPrice,
            professional.EndPrice,
            professional.Bio,
            professional.IsVerified,
            user.ProfilePictureUrl
        ));
    }

    public async Task<Result<List<ProfessionalDto>>> GetProfessionalsByIdsAsync(IEnumerable<Guid> professionalIds, CancellationToken cancellationToken = default)
    {
        var professionals = await professionalsDbContext.Professionals
            .AsNoTracking()
            .Where(p => professionalIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        if (professionals.Count == 0)
        {
            return Result<List<ProfessionalDto>>.Success([]);
        }

        var userIds = professionals.Select(p => p.UserId).Distinct().ToList();
        var usersResult = await identityApi.GetUsersByIdsAsync(userIds, cancellationToken);

        if (usersResult.IsFailure)
        {
            return Result<List<ProfessionalDto>>.Failure(usersResult.Error);
        }

        var users = usersResult.Value.ToDictionary(u => u.Id);

        var dtos = professionals.Select(p =>
        {
            if (!users.TryGetValue(p.UserId, out var user))
            {
                logger.LogWarning("User not found for ProfessionalId: {ProfessionalId}, UserId: {UserId}", p.Id, p.UserId);
                return null;
            }
            return new ProfessionalDto(
                p.Id,
                p.UserId,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.DateOfBirth,
                user.Gender,
                user.Address,
                p.Specialization,
                p.Services,
                p.Experience,
                p.StartPrice,
                p.EndPrice,
                p.Bio,
                p.IsVerified,
                user.ProfilePictureUrl
            );
        }).Where(dto => dto != null).Cast<ProfessionalDto>().ToList();

        return Result<List<ProfessionalDto>>.Success(dtos);
    }
}