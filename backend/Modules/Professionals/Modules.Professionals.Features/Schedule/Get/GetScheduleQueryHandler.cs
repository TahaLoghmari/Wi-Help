using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.Get;

public record GetScheduleQuery(Guid UserId) : IQuery<ScheduleDto>;

public class GetScheduleQueryHandler(ProfessionalsDbContext professionalsDbContext, ILogger<GetScheduleQuery> logger)
    : IQueryHandler<GetScheduleQuery, ScheduleDto>
{
    public async Task<Result<ScheduleDto>> Handle(
        GetScheduleQuery query,
        CancellationToken cancellationToken)
    {
        var professional = await professionalsDbContext.Professionals
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == query.UserId, cancellationToken);
        if (professional is null)
        {
            logger.LogWarning("Professional not found for UserId: {UserId}", query.UserId);
            return Result<ScheduleDto>.Failure(
                Error.NotFound(
                    "GetSchedule.ProfessionalNotFound",
                    $"No professional found for UserId '{query.UserId}'."));
        }
        logger.LogInformation("Getting schedule for professional {ProfessionalId}", professional.Id);
        
        
        var dayAvailabilities = await professionalsDbContext.AvailabilityDays.Include(ad => ad.AvailabilitySlots)
            .Where(ad => ad.ProfessionalId == professional.Id).AsNoTracking().ToListAsync(cancellationToken);

        var dayAvailabilitiesResult = new List<DayAvailabilityDto>();
        
        string timeZoneId = "Africa/Tunis"; // Default time zone
        
        foreach (var day in dayAvailabilities)
        {
            var availabilityRangesDay = new List<AvailabilitySlotDto>();
            timeZoneId = day.TimeZone; // Assuming all days have the same time zone
            foreach (var av in day.AvailabilitySlots)
                availabilityRangesDay.Add(
                    new AvailabilitySlotDto
                    {
                        StartTime = av.TimeRange.StartTime.ToString(),
                        EndTime = av.TimeRange.EndTime.ToString(),
                        Id = av.Id
                    });
            dayAvailabilitiesResult.Add(
                new DayAvailabilityDto
                {
                    DayOfWeek = day.DayOfWeek,
                    IsActive = day.IsActive,
                    AvailabilitySlots = availabilityRangesDay
                });
        }

        var scheduleDto = new ScheduleDto
        {
            Days = dayAvailabilitiesResult,
            TimeZoneId = timeZoneId
        };

        return Result<ScheduleDto>.Success(scheduleDto);
    }
}
