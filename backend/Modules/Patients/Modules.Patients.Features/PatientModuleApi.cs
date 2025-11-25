

using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Patients.Domain;
using Modules.Patients.Infrastructure.Database;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Patients.Features;

public class PatientModuleApi(
    PatientsDbContext dbContext,
    IIdentityModuleApi identityApi) : IPatientsModuleApi
{
    public async Task<Result<List<PatientDto>>> GetPatientsByIdsAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken = default)
    {
        var patients = await dbContext.Patients
            .AsNoTracking()
            .Where(p => patientIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        if (patients.Count == 0)
        {
            return Result<List<PatientDto>>.Success([]);
        }

        var userIds = patients.Select(p => p.UserId).Distinct().ToList();
        var usersResult = await identityApi.GetUsersByIdsAsync(userIds, cancellationToken);

        if (usersResult.IsFailure)
        {
            return Result<List<PatientDto>>.Failure(usersResult.Error);
        }

        var users = usersResult.Value.ToDictionary(u => u.Id);

        var patientDtos = patients.Select(p =>
        {
            if (users.TryGetValue(p.UserId, out var user))
            {
                return new PatientDto(
                    p.Id,
                    p.UserId,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.PhoneNumber,
                    user.ProfilePictureUrl,
                    user.DateOfBirth,
                    user.Gender,
                    user.Address,
                    p.EmergencyContact,
                    p.MedicalInfo,
                    p.Bio
                );
            }
            return null;
        })
        .Where(dto => dto != null)
        .Cast<PatientDto>()
        .ToList();

        return Result<List<PatientDto>>.Success(patientDtos);
    }

    public async Task<Result<PatientDto>> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var patient = await dbContext.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (patient is null)
        {
            return Result<PatientDto>.Failure(PatientErrors.NotFound(userId));
        }

        var usersResult = await identityApi.GetUserByIdAsync(userId, cancellationToken);

        if (usersResult.IsFailure)
        {
            return Result<PatientDto>.Failure(usersResult.Error);
        }

        var user = usersResult.Value;

        var patientDto = new PatientDto(
            patient.Id,
            patient.UserId,
            user.FirstName,
            user.LastName,
            user.Email,
            user.PhoneNumber,
            user.ProfilePictureUrl,
            user.DateOfBirth,
            user.Gender,
            user.Address,
            patient.EmergencyContact,
            patient.MedicalInfo,
            patient.Bio
        );

        return Result<PatientDto>.Success(patientDto);
    }
}
