using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Identity.PublicApi;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.GetAllPatients;

internal sealed class GetAllPatientsQueryHandler(
    PatientsDbContext dbContext,
    IIdentityModuleApi identityModuleApi)
    : IQueryHandler<GetAllPatientsQuery, PaginationResultDto<GetAllPatientsDto>>
{
    public async Task<Result<PaginationResultDto<GetAllPatientsDto>>> Handle(GetAllPatientsQuery request, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Patients.CountAsync(cancellationToken);

        var patients = await dbContext.Patients
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var userIds = patients.Select(p => p.UserId).Distinct();

        var usersResult = await identityModuleApi.GetUsersByIdsAsync(userIds, cancellationToken);
        if (usersResult.IsFailure)
        {
            return Result<PaginationResultDto<GetAllPatientsDto>>.Failure(usersResult.Error);
        }

        var users = usersResult.Value.ToDictionary(u => u.Id);

        var dtos = patients.Select(p =>
        {
            var user = users.GetValueOrDefault(p.UserId);
            if (user == null) return null;

            var age = CalculateAge(DateTime.Parse(user.DateOfBirth));

            return new GetAllPatientsDto(
                p.Id,
                p.UserId,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.ProfilePictureUrl ?? "",
                age,
                user.DateOfBirth,
                user.Gender,
                user.Address,
                p.EmergencyContact,
                p.MedicalInfo,
                p.Bio,
                0, // Paid - requires cross-module call
                user.IsBanned
            );
        }).Where(d => d != null).Cast<GetAllPatientsDto>().ToList();

        return Result<PaginationResultDto<GetAllPatientsDto>>.Success(
            new PaginationResultDto<GetAllPatientsDto>
            {
                Items = dtos,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = totalCount
            });
    }

    private static int CalculateAge(DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth.Date > today.AddYears(-age)) age--;
        return age;
    }
}
