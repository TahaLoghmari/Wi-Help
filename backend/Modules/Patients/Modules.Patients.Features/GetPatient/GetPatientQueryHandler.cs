using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Patients.Domain;
using Modules.Patients.Infrastructure.Database;
using Modules.Patients.Infrastructure.DTOs;

namespace Modules.Patients.Features.GetPatient;

public sealed class GetPatientQueryHandler(
    IIdentityModuleApi identityApi,
    PatientsDbContext dbContext,
    ILogger<GetPatientQueryHandler> logger) : IQueryHandler<GetPatientQuery, PatientProfileDto>
{
    public async Task<Result<PatientProfileDto>> Handle(
        GetPatientQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving patient profile for PatientId: {PatientId}", query.PatientId);

        var patient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.Id == query.PatientId, cancellationToken);

        if (patient is null)
        {
            logger.LogWarning("Patient profile not found for PatientId: {PatientId}", query.PatientId);
            return Result<PatientProfileDto>.Failure(
                PatientErrors.NotFoundByPatientId(query.PatientId));
        }

        var userResult = await identityApi.GetUserByIdAsync(patient.UserId, cancellationToken);
        if (!userResult.IsSuccess)
        {
            logger.LogWarning("Failed to retrieve user for UserId: {UserId}", patient.UserId);
            return Result<PatientProfileDto>.Failure(userResult.Error);
        }

        var user = userResult.Value;

        var profileDto = new PatientProfileDto(
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

        return Result<PatientProfileDto>.Success(profileDto);
    }
}
