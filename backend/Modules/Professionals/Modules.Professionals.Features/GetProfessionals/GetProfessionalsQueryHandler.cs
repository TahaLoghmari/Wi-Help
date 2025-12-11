using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Identity.PublicApi;
using Modules.Professionals.Features.GetProfessional;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionals;

public sealed class GetProfessionalsQueryHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    ILogger<GetProfessionalsQueryHandler> logger) : IQueryHandler<GetProfessionalsQuery, PaginationResultDto<GetProfessionalDto>>
{
    public async Task<Result<PaginationResultDto<GetProfessionalDto>>> Handle(
        GetProfessionalsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving professionals with filters: {@Query}", query);

        var professionalsQuery = dbContext.Professionals
            .AsNoTracking()
            .AsQueryable();

        if (query.MaxPrice.HasValue)
        {
            professionalsQuery = professionalsQuery.Where(p => p.EndPrice <= query.MaxPrice.Value);
        }

        // Availability Filter
        // if (!string.IsNullOrEmpty(query.Availability) && query.Availability != "Any time")
        // {
        //     var today = DateTime.UtcNow.DayOfWeek;
        //     if (query.Availability == "Today")
        //     {
        //         professionalsQuery = professionalsQuery.Where(p => p.AvailabilityDays.Any(d => d.DayOfWeek == today && d.IsActive));
        //     }
        //     else if (query.Availability == "Within 24h")
        //     {
        //         var tomorrow = DateTime.UtcNow.AddDays(1).DayOfWeek;
        //         professionalsQuery = professionalsQuery.Where(p => p.AvailabilityDays.Any(d => (d.DayOfWeek == today || d.DayOfWeek == tomorrow) && d.IsActive));
        //     }
        //     else if (query.Availability == "This week")
        //     {
        //         professionalsQuery = professionalsQuery.Where(p => p.AvailabilityDays.Any(d => d.IsActive));
        //     }
        // }

        var professionals = await professionalsQuery.ToListAsync(cancellationToken);

        if (professionals.Count == 0)
        {
            return Result<PaginationResultDto<GetProfessionalDto>>.Success(new PaginationResultDto<GetProfessionalDto>
            {
                Items = [],
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = 0
            });
        }

        var userIds = professionals.Select(p => p.UserId).Distinct().ToList();

        var usersResult = await identityApi.GetUsersByIdsAsync(userIds, cancellationToken);
        if (!usersResult.IsSuccess)
        {
            logger.LogError("Failed to retrieve users for professionals. Error: {Error}", usersResult.Error);
            return Result<PaginationResultDto<GetProfessionalDto>>.Failure(usersResult.Error);
        }

        var users = usersResult.Value.ToDictionary(u => u.Id);
        var professionalDtos = new List<GetProfessionalDto>();

        foreach (var professional in professionals)
        {
            if (users.TryGetValue(professional.UserId, out var user))
            {
                bool matchesSearch = string.IsNullOrEmpty(query.Search) ||
                                     (user.FirstName.Contains(query.Search, StringComparison.OrdinalIgnoreCase)) ||
                                     (user.LastName.Contains(query.Search, StringComparison.OrdinalIgnoreCase)) ||
                                     (professional.Specialization.Contains(query.Search, StringComparison.OrdinalIgnoreCase));

                bool matchesLocation = string.IsNullOrEmpty(query.Location) ||
                                       (
                                            user.Address.City.Contains(query.Location, StringComparison.OrdinalIgnoreCase) ||
                                            user.Address.State.Contains(query.Location, StringComparison.OrdinalIgnoreCase) ||
                                            user.Address.Country.Contains(query.Location, StringComparison.OrdinalIgnoreCase) ||
                                            user.Address.Street.Contains(query.Location, StringComparison.OrdinalIgnoreCase)
                                       );

                if (matchesSearch && matchesLocation)
                {
                    professionalDtos.Add(new GetProfessionalDto(
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
                        professional.StartPrice,
                        professional.EndPrice,
                        professional.Bio,
                        professional.IsVerified,
                        user.ProfilePictureUrl,
                        professional.VerificationStatus));
                }
            }
            else
            {
                logger.LogWarning("User not found for ProfessionalId: {ProfessionalId}, UserId: {UserId}", professional.Id, professional.UserId);
            }
        }

        logger.LogInformation("Retrieved {Count} professionals", professionalDtos.Count);

        var totalCount = professionalDtos.Count;
        var items = professionalDtos.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize).ToList();

        return Result<PaginationResultDto<GetProfessionalDto>>.Success(new PaginationResultDto<GetProfessionalDto>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
