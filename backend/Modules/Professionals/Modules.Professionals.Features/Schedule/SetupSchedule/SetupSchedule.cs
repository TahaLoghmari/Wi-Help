using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.SetupSchedule;

public class SetupSchedule : IEndpoint
{

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.SetupSchedule, async (
                HttpContext httpContext,
                Request request,
                ICommandHandler<SetupScheduleCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;
                
                if (!Guid.TryParse(professionalIdString, out var professionalIdGuid))
                {
                    return CustomResults.Problem(
                        Error.Unauthorized(
                            "SetupSchedule.Unauthorized",
                            "Professional ID claim is missing or invalid."));
                }

                var command = new SetupScheduleCommand(
                    request.DayAvailabilities ?? [],
                    professionalIdGuid);

                var result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.Professionals);
    }
    
    private record Request
    {
        public List<AvailabilityDayDto>? DayAvailabilities { get; init; }
    }
}

