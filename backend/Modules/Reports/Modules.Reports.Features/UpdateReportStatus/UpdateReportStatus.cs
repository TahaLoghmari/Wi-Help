using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

using Modules.Reports.Domain.Enums;

namespace Modules.Reports.Features.UpdateReportStatus;

internal sealed class UpdateReportStatus : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ReportsEndpoints.UpdateReportStatus, async (
                Guid reportId,
                UpdateReportStatusRequest request,
                ICommandHandler<UpdateReportStatusCommand> handler,
                CancellationToken cancellationToken) =>
            {
                if (!Enum.TryParse<ReportStatus>(request.Status, true, out var status))
                {
                    return Results.BadRequest("Invalid status");
                }

                var command = new UpdateReportStatusCommand(reportId, status);
                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Reports)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }
}

public record UpdateReportStatusRequest(string Status);
