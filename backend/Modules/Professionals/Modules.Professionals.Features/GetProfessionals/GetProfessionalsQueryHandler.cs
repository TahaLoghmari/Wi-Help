using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionals;

public sealed class GetProfessionalsQueryHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    ILogger<GetProfessionalsQueryHandler> logger) : IQueryHandler<GetProfessionalsQuery, List<ProfessionalProfileDto>>
{
    public async Task<Result<List<ProfessionalProfileDto>>> Handle(
        GetProfessionalsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving professionals with filters: {@Query}", query);

        var professionalsQuery = dbContext.Professionals
            .Include(p => p.AvailabilityDays)
            .AsNoTracking()
            .AsQueryable();

        // Price Filter
        if (query.Parameters.MaxPrice.HasValue)
        {
            professionalsQuery = professionalsQuery.Where(p => p.EndPrice <= query.Parameters.MaxPrice.Value);
        }

        // Availability Filter
        // if (!string.IsNullOrEmpty(query.Parameters.Availability) && query.Parameters.Availability != "Any time")
        // {
        //     var today = DateTime.UtcNow.DayOfWeek;
        //     if (query.Parameters.Availability == "Today")
        //     {
        //         professionalsQuery = professionalsQuery.Where(p => p.AvailabilityDays.Any(d => d.DayOfWeek == today && d.IsActive));
        //     }
        //     else if (query.Parameters.Availability == "Within 24h")
        //     {
        //         var tomorrow = DateTime.UtcNow.AddDays(1).DayOfWeek;
        //         professionalsQuery = professionalsQuery.Where(p => p.AvailabilityDays.Any(d => (d.DayOfWeek == today || d.DayOfWeek == tomorrow) && d.IsActive));
        //     }
        //     else if (query.Parameters.Availability == "This week")
        //     {
        //         professionalsQuery = professionalsQuery.Where(p => p.AvailabilityDays.Any(d => d.IsActive));
        //     }
        // }

        var professionals = await professionalsQuery.ToListAsync(cancellationToken);

        if (professionals.Count == 0)
        {
            return Result<List<ProfessionalProfileDto>>.Success([]);
        }

        var userIds = professionals.Select(p => p.UserId).Distinct().ToList();

        var usersResult = await identityApi.GetUsersByIdsAsync(userIds, cancellationToken);
        if (!usersResult.IsSuccess)
        {
            logger.LogError("Failed to retrieve users for professionals. Error: {Error}", usersResult.Error);
            return Result<List<ProfessionalProfileDto>>.Failure(usersResult.Error);
        }

        var users = usersResult.Value.ToDictionary(u => u.Id);
        var professionalDtos = new List<ProfessionalProfileDto>();

        foreach (var professional in professionals)
        {
            if (users.TryGetValue(professional.UserId, out var user))
            {
                bool matchesSearch = string.IsNullOrEmpty(query.Parameters.Search) ||
                                     (user.FirstName.Contains(query.Parameters.Search, StringComparison.OrdinalIgnoreCase)) ||
                                     (user.LastName.Contains(query.Parameters.Search, StringComparison.OrdinalIgnoreCase)) ||
                                     (professional.Specialization.Contains(query.Parameters.Search, StringComparison.OrdinalIgnoreCase));

                bool matchesLocation = string.IsNullOrEmpty(query.Parameters.Location) ||
                                       (
                                            user.Address.City.Contains(query.Parameters.Location, StringComparison.OrdinalIgnoreCase) ||
                                            user.Address.State.Contains(query.Parameters.Location, StringComparison.OrdinalIgnoreCase) ||
                                            user.Address.Country.Contains(query.Parameters.Location, StringComparison.OrdinalIgnoreCase) ||
                                            user.Address.Street.Contains(query.Parameters.Location, StringComparison.OrdinalIgnoreCase)
                                       );

                if (matchesSearch && matchesLocation)
                {
                    professionalDtos.Add(new ProfessionalProfileDto(
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
                        professional.Services.ToList(),
                        professional.Experience,
                        professional.StartPrice,
                        professional.EndPrice,
                        professional.Bio,
                        professional.IsVerified,
                        user.ProfilePictureUrl));
                }
            }
            else
            {
                logger.LogWarning("User not found for ProfessionalId: {ProfessionalId}, UserId: {UserId}", professional.Id, professional.UserId);
            }
        }

        logger.LogInformation("Retrieved {Count} professionals", professionalDtos.Count);

        return Result<List<ProfessionalProfileDto>>.Success(professionalDtos);
    }
}
