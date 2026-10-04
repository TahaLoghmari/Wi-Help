using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Identity.PublicApi;
using Modules.Professionals.Domain.Repositories;

namespace Modules.Professionals.Features.GetProfessionalsForAdmin;

internal sealed class GetProfessionalsForAdminQueryHandler(
    IProfessionalRepository repository,
    IIdentityModuleApi identityModuleApi)
    : IQueryHandler<GetProfessionalsForAdminQuery, PaginationResultDto<GetProfessionalsForAdminDto>>
{
    public async Task<Result<PaginationResultDto<GetProfessionalsForAdminDto>>> Handle(GetProfessionalsForAdminQuery request, CancellationToken cancellationToken)
    {
        var totalCount = await repository.CountAsync(cancellationToken);

        var professionals = await repository.GetAdminPageAsync(request.Page, request.PageSize, cancellationToken);

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
                p.Specialization.Key,
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
