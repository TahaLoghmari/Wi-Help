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
            professionalsQuery = professionalsQuery.Where(p => p.VisitPrice <= query.MaxPrice.Value || p.VisitPrice == null );
        }

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
        
        // Check if distance filtering is enabled
        bool distanceFilterEnabled = query.UserLatitude.HasValue && 
                                      query.UserLongitude.HasValue;
        
        var professionalDtos = new List<(GetProfessionalDto Dto, double? Distance)>();

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
                    double? distanceKm = null;
                    
                    // Calculate distance if user coordinates provided and professional has location
                    if (distanceFilterEnabled && user.Location is not null)
                    {
                        distanceKm = user.Location.DistanceTo(
                            query.UserLatitude!.Value,
                            query.UserLongitude!.Value);
                        
                        // Skip if outside max distance
                        if (query.MaxDistanceKm.HasValue && distanceKm > query.MaxDistanceKm.Value)
                        {
                            continue;
                        }
                    }
                    // If distance filter is enabled but professional has no location, exclude them
                    else if (distanceFilterEnabled && user.Location is null)
                    {
                        continue;
                    }

                    var dto = new GetProfessionalDto(
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
                        professional.VisitPrice,
                        professional.Bio,
                        professional.IsVerified,
                        user.ProfilePictureUrl,
                        professional.VerificationStatus,
                        distanceKm.HasValue ? Math.Round(distanceKm.Value, 1) : null);
                    
                    professionalDtos.Add((dto, distanceKm));
                }
            }
            else
            {
                logger.LogWarning("User not found for ProfessionalId: {ProfessionalId}, UserId: {UserId}", professional.Id, professional.UserId);
            }
        }

        // Sort by distance if distance filtering is active
        IEnumerable<GetProfessionalDto> sortedDtos;
        if (distanceFilterEnabled)
        {
            sortedDtos = professionalDtos
                .OrderBy(x => x.Distance ?? double.MaxValue)
                .Select(x => x.Dto);
        }
        else
        {
            sortedDtos = professionalDtos.Select(x => x.Dto);
        }

        logger.LogInformation("Retrieved {Count} professionals", professionalDtos.Count);

        var totalCount = professionalDtos.Count;
        var items = sortedDtos.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize).ToList();

        return Result<PaginationResultDto<GetProfessionalDto>>.Success(new PaginationResultDto<GetProfessionalDto>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
