namespace Modules.Reports.Features.GetReportsForAdmin;

public sealed record ReportAdminDto(
    Guid Id,
    Guid ReporterId,
    string ReporterName,
    string ReporterEmail,
    string ReporterPhone,
    string ReporterProfilePicture,
    Guid ReportedId,
    string ReportedName,
    string ReportedEmail,
    string ReportedPhone,
    string ReportedProfilePicture,
    string Title,
    string Description,
    DateTime Date,
    string Status
);
