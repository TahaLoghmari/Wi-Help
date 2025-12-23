using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Auth.GetCurrentProfessional;

public sealed class GetCurrentProfessionalQueryHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    ILogger<GetCurrentProfessionalQueryHandler> logger) : IQueryHandler<GetCurrentProfessionalQuery, GetCurrentProfessionalDto>
{
    public async Task<Result<GetCurrentProfessionalDto>> Handle(
        GetCurrentProfessionalQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving current professional profile for UserId: {UserId}", query.UserId);

        var userResult = await identityApi.GetUserByIdAsync(query.UserId, cancellationToken);
        if (!userResult.IsSuccess)
        {
            logger.LogWarning("Failed to retrieve user for UserId: {UserId}", query.UserId);
            return Result<GetCurrentProfessionalDto>.Failure(userResult.Error);
        }

        var user = userResult.Value;

        var professional = await dbContext.Professionals
            .FirstOrDefaultAsync(p => p.UserId == query.UserId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional profile not found for UserId: {UserId}", query.UserId);
            return Result<GetCurrentProfessionalDto>.Failure(
                ProfessionalErrors.NotFound(query.UserId));
        }

        var profileDto = new GetCurrentProfessionalDto(
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
            professional.VisitPrice,
            professional.Bio,
            professional.IsVerified,
            user.ProfilePictureUrl,
            professional.VerificationStatus);

        logger.LogInformation("Professional profile retrieved successfully for UserId: {UserId}", query.UserId);

        return Result<GetCurrentProfessionalDto>.Success(profileDto);
    }
}
