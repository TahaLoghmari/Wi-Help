using Modules.Common.Features.Abstractions;
using Modules.Reports.Domain.Enums;

namespace Modules.Reports.Features.UpdateReportStatus;

public sealed record UpdateReportStatusCommand(Guid ReportId, ReportStatus Status) : ICommand;
