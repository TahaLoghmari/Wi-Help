using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.Setup;

public class SetupSchedule : IEndpoint
{
    public record Request
    {
        public string TimeZoneId { get; init; } = "Africa/Tunis";
        public List<DayAvailabilityDto>? DayAvailabilities { get; init; }
    }

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.SetupSchedule, async (
                HttpContext httpContext,
                Request request,
                ICommandHandler<SetupScheduleCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (!Guid.TryParse(userIdString, out var userIdGuid))
                {
                    return CustomResults.Problem(
                        Error.Unauthorized(
                            "SetupSchedule.Unauthorized",
                            "User ID claim is missing or invalid."));
                }

                var command = new SetupScheduleCommand(
                    request.DayAvailabilities ?? [],
                    userIdGuid,
                    request.TimeZoneId);

                var result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.Professionals);
    }
}

