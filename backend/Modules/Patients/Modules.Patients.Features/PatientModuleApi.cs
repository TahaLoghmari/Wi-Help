

using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
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
                    user.ProfilePictureUrl,
                    user.DateOfBirth,
                    user.Gender
                );
            }
            return null;
        })
        .Where(dto => dto != null)
        .Cast<PatientDto>()
        .ToList();

        return Result<List<PatientDto>>.Success(patientDtos);
    }
}
