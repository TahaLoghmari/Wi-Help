using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Auth.GetCurrentProfessional;

public sealed class GetCurrentProfessionalQueryHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    ILogger<GetCurrentProfessionalQueryHandler> logger) : IQueryHandler<GetCurrentProfessionalQuery, ProfessionalProfileDto>
{
    public async Task<Result<ProfessionalProfileDto>> Handle(
        GetCurrentProfessionalQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving current professional profile for UserId: {UserId}", query.UserId);

        // Get user from Identity module
        var userResult = await identityApi.GetUserByIdAsync(query.UserId, cancellationToken);
        if (!userResult.IsSuccess)
        {
            logger.LogWarning("Failed to retrieve user for UserId: {UserId}", query.UserId);
            return Result<ProfessionalProfileDto>.Failure(userResult.Error);
        }

        var user = userResult.Value;

        // Get professional profile
        var professional = await dbContext.Professionals
            .FirstOrDefaultAsync(p => p.UserId == query.UserId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional profile not found for UserId: {UserId}", query.UserId);
            return Result<ProfessionalProfileDto>.Failure(
                ProfessionalErrors.NotFound(query.UserId));
        }

        var profileDto = new ProfessionalProfileDto(
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
            professional.Services.ToList(),
            professional.Experience,
            professional.StartPrice,
            professional.EndPrice,
            professional.Bio,
            professional.IsVerified,
            user.Role);

        logger.LogInformation("Professional profile retrieved successfully for UserId: {UserId}", query.UserId);

        return Result<ProfessionalProfileDto>.Success(profileDto);
    }
}
