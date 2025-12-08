using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Identity.PublicApi;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.GetProfessionalsForAdmin;

internal sealed class GetProfessionalsForAdminQueryHandler(
    ProfessionalsDbContext dbContext,
    IIdentityModuleApi identityModuleApi)
    : IQueryHandler<GetProfessionalsForAdminQuery, PaginationResultDto<GetProfessionalsForAdminDto>>
{
    public async Task<Result<PaginationResultDto<GetProfessionalsForAdminDto>>> Handle(GetProfessionalsForAdminQuery request, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Professionals.CountAsync(cancellationToken);

        var professionals = await dbContext.Professionals
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var userIds = professionals.Select(p => p.UserId).Distinct();

        var usersResult = await identityModuleApi.GetUsersByIdsAsync(userIds, cancellationToken);
        if (usersResult.IsFailure)
        {
            return Result<PaginationResultDto<GetProfessionalsForAdminDto>>.Failure(usersResult.Error);
        }

        var users = usersResult.Value.ToDictionary(u => u.Id);

        var dtos = professionals.Select(p =>
        {
            var user = users.GetValueOrDefault(p.UserId);
            if (user == null) return null;

            return new GetProfessionalsForAdminDto(
                p.Id,
                p.UserId,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.ProfilePictureUrl ?? "",
                p.Specialization,
                p.CreatedAt,
                0, // Earned - requires cross-module call
                p.VerificationStatus,
                user.IsBanned
            );
        }).Where(d => d != null).Cast<GetProfessionalsForAdminDto>().ToList();

        return Result<PaginationResultDto<GetProfessionalsForAdminDto>>.Success(
            new PaginationResultDto<GetProfessionalsForAdminDto>
            {
                Items = dtos,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = totalCount
            });
    }
}
