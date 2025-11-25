using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.Get;

public class GetScheduleQueryHandler(ProfessionalsDbContext professionalsDbContext, ILogger<GetScheduleQuery> logger)
    : IQueryHandler<GetScheduleQuery, GetScheduleDto>
{
    public async Task<Result<GetScheduleDto>> Handle(
        GetScheduleQuery query,
        CancellationToken cancellationToken)
    {
        
        logger.LogInformation("Getting schedule for professional {ProfessionalId}", query.ProfessionalId);
        
        // retrieve all professional available days with availability slots
        var dayAvailabilities = await professionalsDbContext.AvailabilityDays.Include(ad => ad.AvailabilitySlots)
            .Where(ad => ad.ProfessionalId == query.ProfessionalId).AsNoTracking().ToListAsync(cancellationToken);

        var dayAvailabilitiesResult = new List<AvailabilityDayDto>();
        
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
                new AvailabilityDayDto
                {
                    DayOfWeek = day.DayOfWeek,
                    IsActive = day.IsActive,
                    AvailabilitySlots = availabilityRangesDay
                });
        }

        var scheduleDto = new GetScheduleDto
        {
            Days = dayAvailabilitiesResult,
            TimeZoneId = timeZoneId
        };

        return Result<GetScheduleDto>.Success(scheduleDto);
    }
}
