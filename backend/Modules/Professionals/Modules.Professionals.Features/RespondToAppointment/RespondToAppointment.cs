using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.RespondToAppointment;

public class RespondToAppointment : IEndpoint
{
    public sealed record Request(
        Guid AppointmentId,
        bool IsAccepted);

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.RespondToAppointment, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<RespondToAppointmentCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userId = httpContext.User.FindFirst("sub")?.Value ??
                             httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (!Guid.TryParse(userId, out Guid userIdGuid))
                {
                    return Results.Unauthorized();
                }

                var command = new RespondToAppointmentCommand(
                    request.AppointmentId,
                    userIdGuid,
                    request.IsAccepted
                );

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}

public record RespondToAppointmentCommand(
    Guid AppointmentId,
    Guid ProfessionalUserId,
    bool IsAccepted
) : ICommand;

public class RespondToAppointmentCommandHandler(
    IAppointmentsModuleApi appointmentsModuleApi,
    ProfessionalsDbContext professionalsDbContext,
    ILogger<RespondToAppointmentCommandHandler> logger) : ICommandHandler<RespondToAppointmentCommand>
{
    public async Task<Result> Handle(RespondToAppointmentCommand command, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation(
                "Professional user {UserId} responding to appointment {AppointmentId} with action: {Action}",
                command.ProfessionalUserId, command.AppointmentId, command.IsAccepted ? "Accept" : "Reject");

            var professional = await professionalsDbContext.Professionals
                .FirstOrDefaultAsync(p => p.UserId == command.ProfessionalUserId, cancellationToken);

            if (professional == null)
            {
                logger.LogWarning("Professional with UserId {UserId} not found", command.ProfessionalUserId);
                return Result.Failure(
                    Error.NotFound(
                        "Professional.NotFound",
                        "Professional not found."));
            }

            var result = await appointmentsModuleApi.RespondToAppointmentAsync(
                command.AppointmentId,
                professional.Id,
                command.IsAccepted,
                cancellationToken);

            if (result.IsSuccess)
            {
                logger.LogInformation(
                    "Professional {ProfessionalId} successfully responded to appointment {AppointmentId}",
                    professional.Id, command.AppointmentId);
            }

            return result;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to respond to appointment {AppointmentId}", command.AppointmentId);
            return Result.Failure(
                Error.Failure(
                    "RespondToAppointment.Failed",
                    "An error occurred while responding to the appointment."));
        }
    }
}
