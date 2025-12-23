using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessional;

public sealed class GetProfessionalQueryHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    ILogger<GetProfessionalQueryHandler> logger) : IQueryHandler<GetProfessionalQuery, GetProfessionalDto>
{
    public async Task<Result<GetProfessionalDto>> Handle(
        GetProfessionalQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving professional profile for ProfessionalId: {ProfessionalId}", query.ProfessionalId);

        var professional = await dbContext.Professionals
            .FirstOrDefaultAsync(p => p.Id == query.ProfessionalId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional profile not found for ProfessionalId: {ProfessionalId}", query.ProfessionalId);
            return Result<GetProfessionalDto>.Failure(
                ProfessionalErrors.NotFound(query.ProfessionalId));
        }

        var userResult = await identityApi.GetUserByIdAsync(professional.UserId, cancellationToken);
        if (!userResult.IsSuccess)
        {
            logger.LogWarning("Failed to retrieve user for UserId: {UserId}", professional.UserId);
            return Result<GetProfessionalDto>.Failure(userResult.Error);
        }

        var user = userResult.Value;

        // Calculate distance if requester coordinates are provided and professional has location
        double? distanceKm = null;
        if (query.RequesterLatitude.HasValue && 
            query.RequesterLongitude.HasValue && 
            user.Location is not null)
        {
            distanceKm = Math.Round(user.Location.DistanceTo(
                query.RequesterLatitude.Value,
                query.RequesterLongitude.Value), 1);
        }

        var profileDto = new GetProfessionalDto(
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
            professional.VerificationStatus,
            distanceKm);

        return Result<GetProfessionalDto>.Success(profileDto);
    }
}
