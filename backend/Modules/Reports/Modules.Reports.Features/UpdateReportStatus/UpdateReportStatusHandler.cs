using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reports.Infrastructure.Database;

namespace Modules.Reports.Features.UpdateReportStatus;

public class UpdateReportStatusHandler(
    ReportsDbContext dbContext,
    ILogger<UpdateReportStatusHandler> logger) : ICommandHandler<UpdateReportStatusCommand>
{
    public async Task<Result> Handle(UpdateReportStatusCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating report status for report {ReportId}", command.ReportId);

        var report = await dbContext.Reports
            .FirstOrDefaultAsync(r => r.Id == command.ReportId, cancellationToken);

        if (report is null)
        {
            return Result.Failure(new Error("Report.NotFound", "Report not found", ErrorType.NotFound));
        }

        report.UpdateStatus(command.Status);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
