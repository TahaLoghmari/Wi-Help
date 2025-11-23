using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Schedule;
public sealed record DayAvailability
{
    public DayOfWeek DayOfWeek { get; init; }
    public bool IsActive { get; init; }
    public List<AvailabilityRange> AvailabilityRanges { get; init; } = [];
}

public sealed record AvailabilityRange
{
    public Guid? Id { get; init; } = null;
    public required string StartTime { get; init; }
    public required string EndTime { get; init; }
}
public class SetupSchedule : IEndpoint
{
    public record Request
    {
        public Guid ProfessionalId { get; init; }
        public string TimeZoneId { get; init; } = "Africa/Tunis";
        public List<DayAvailability>? DayAvailabilities { get; init; }
    }

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.SetupSchedule, async (
                Request request,
                ICommandHandler<SetupScheduleCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new SetupScheduleCommand(
                    request.DayAvailabilities ?? [],
                    request.ProfessionalId,
                    request.TimeZoneId);

                var result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.Professionals);
    }
}

