using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Patients.Domain;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.Auth.GetCurrentPatient;

public sealed class GetCurrentPatientQueryHandler(
    IIdentityModuleApi identityApi,
    PatientsDbContext dbContext,
    ILogger<GetCurrentPatientQueryHandler> logger) : IQueryHandler<GetCurrentPatientQuery, GetCurrentPatientDto>
{
    public async Task<Result<GetCurrentPatientDto>> Handle(
        GetCurrentPatientQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving current patient profile for UserId: {UserId}", query.UserId);

        var userResult = await identityApi.GetUserByIdAsync(query.UserId, cancellationToken);
        if (!userResult.IsSuccess)
        {
            logger.LogWarning("Failed to retrieve user for UserId: {UserId}", query.UserId);
            return Result<GetCurrentPatientDto>.Failure(userResult.Error);
        }

        var user = userResult.Value;

        var patient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.UserId == query.UserId, cancellationToken);

        if (patient is null)
        {
            logger.LogWarning("Patient profile not found for UserId: {UserId}", query.UserId);
            return Result<GetCurrentPatientDto>.Failure(
                PatientErrors.NotFound(query.UserId));
        }

        var profileDto = new GetCurrentPatientDto(
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
            user.ProfilePictureUrl);

        logger.LogInformation("Patient profile retrieved successfully for UserId: {UserId}", query.UserId);

        return Result<GetCurrentPatientDto>.Success(profileDto);
    }
}
