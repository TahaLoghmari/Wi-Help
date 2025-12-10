using Modules.Reports.Domain.Enums;

namespace Modules.Reports.Domain.Entities;

public class Report
{
    public Guid Id { get; private set; }
    public Guid ReporterId { get; private set; }
    public Guid ReportedId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public ReportStatus Status { get; private set; }
    public ReportType Type { get; private set; }

    private Report() { }

    public Report(
        Guid reporterId,
        Guid reportedId,
        string title,
        string description,
        ReportType type = ReportType.Patient)
    {
        Id = Guid.NewGuid();
        ReporterId = reporterId;
        ReportedId = reportedId;
        Title = title;
        Description = description;
        CreatedAt = DateTime.UtcNow;
        Status = ReportStatus.Pending;
        Type = type;
    }

    public void MarkAsReviewed()
    {
        Status = ReportStatus.Reviewed;
    }

    public void UpdateStatus(ReportStatus status)
    {
        Status = status;
    }
}
