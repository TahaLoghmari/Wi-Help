

using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
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

    public async Task<Result<PaginationResultDto<PatientAdminDto>>> GetAllPatientsForAdminAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = dbContext.Patients
            .AsNoTracking()
            .OrderBy(p => p.Id);

        var totalCount = await baseQuery.CountAsync(cancellationToken);

        var patients = await baseQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Get user IDs
        var userIds = patients.Select(p => p.UserId).ToList();

        // Fetch user data from Identity module
        var usersResult = await identityApi.GetUsersByIdsAsync(userIds, cancellationToken);
        if (usersResult.IsFailure)
        {
            return Result<PaginationResultDto<PatientAdminDto>>.Failure(usersResult.Error);
        }

        var usersMap = usersResult.Value.ToDictionary(u => u.Id);

        // Map to DTOs - Note: LastAppointmentDate and TotalPaid will be populated by caller (Appointments module)
        var patientDtos = patients.Select(p =>
        {
            var user = usersMap.TryGetValue(p.UserId, out var u) ? u : null;

            // Calculate age from DateOfBirth
            int age = 0;
            if (user != null && DateTime.TryParse(user.DateOfBirth, out var dob))
            {
                age = DateTime.UtcNow.Year - dob.Year;
                if (DateTime.UtcNow < dob.AddYears(age)) age--;
            }

            // Format address as string
            string? addressString = null;
            if (user?.Address != null)
            {
                var parts = new List<string>();
                if (!string.IsNullOrWhiteSpace(user.Address.Street))
                    parts.Add(user.Address.Street);
                if (!string.IsNullOrWhiteSpace(user.Address.City))
                    parts.Add(user.Address.City);
                if (!string.IsNullOrWhiteSpace(user.Address.State))
                    parts.Add(user.Address.State);
                if (!string.IsNullOrWhiteSpace(user.Address.Country))
                    parts.Add(user.Address.Country);
                addressString = parts.Count > 0 ? string.Join(", ", parts) : null;
            }

            return new PatientAdminDto(
                p.Id,
                p.UserId,
                user?.FirstName ?? "",
                user?.LastName ?? "",
                user?.ProfilePictureUrl,
                user?.Email ?? "",
                user?.PhoneNumber,
                age,
                addressString,
                null, // LastAppointmentDate - will be populated by caller
                0     // TotalPaid - will be populated by caller
            );
        }).ToList();

        return Result<PaginationResultDto<PatientAdminDto>>.Success(
            new PaginationResultDto<PatientAdminDto>
            {
                Items = patientDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
    }
}
