using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Patients.Domain;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.GetPatient;

public sealed class GetPatientQueryHandler(
    IIdentityModuleApi identityApi,
    PatientsDbContext dbContext,
    ILogger<GetPatientQueryHandler> logger) : IQueryHandler<GetPatientQuery, GetPatientDto>
{
    public async Task<Result<GetPatientDto>> Handle(
        GetPatientQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving patient profile for PatientId: {PatientId}", query.PatientId);

        var patient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.Id == query.PatientId, cancellationToken);

        if (patient is null)
        {
            logger.LogWarning("Patient profile not found for PatientId: {PatientId}", query.PatientId);
            return Result<GetPatientDto>.Failure(
                PatientErrors.NotFoundByPatientId(query.PatientId));
        }

        var userResult = await identityApi.GetUserByIdAsync(patient.UserId, cancellationToken);
        if (!userResult.IsSuccess)
        {
            logger.LogWarning("Failed to retrieve user for UserId: {UserId}", patient.UserId);
            return Result<GetPatientDto>.Failure(userResult.Error);
        }

        var user = userResult.Value;

        // Calculate distance if requester coordinates are provided and patient has location
        double? distanceKm = null;
        if (query.RequesterLatitude.HasValue && 
            query.RequesterLongitude.HasValue && 
            user.Location is not null)
        {
            distanceKm = Math.Round(user.Location.DistanceTo(
                query.RequesterLatitude.Value,
                query.RequesterLongitude.Value), 1);
        }

        var profileDto = new GetPatientDto(
            patient.Id,
            patient.UserId,
            user.FirstName,
            user.LastName,
            user.Email,
            user.PhoneNumber,
            user.DateOfBirth,
            user.Gender,
            user.Address,
            patient.EmergencyContact,
            patient.MedicalInfo,
            patient.Bio,
            user.ProfilePictureUrl,
            distanceKm);

        return Result<GetPatientDto>.Success(profileDto);
    }
}
