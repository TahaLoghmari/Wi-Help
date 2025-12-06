namespace Modules.Common.Infrastructure.Templates;

public static class AppointmentEmailTemplates
{
    public static string AppointmentBooked(
        string professionalName,
        string patientName,
        string patientEmail,
        string patientPhone,
        DateTime startDate,
        DateTime endDate,
        string urgency,
        decimal price,
        string? notes)
    {
        // Convert UTC times to local timezone (Tunisia)
        var localStartDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
        var localEndDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(endDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
            
        var formattedStartDate = localStartDate.ToString("dddd, MMMM dd, yyyy");
        var formattedStartTime = localStartDate.ToString("hh:mm tt");
        var formattedEndTime = localEndDate.ToString("hh:mm tt");
        var duration = (localEndDate - localStartDate).TotalHours;
        var formattedPrice = $"{price:F2} TND";
        
        var notesSection = string.IsNullOrWhiteSpace(notes) ? "" : $@"
                <div style=""margin-bottom: 0;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📝 Notes:</p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a; font-style: italic;"">{notes}</p>
                </div>";
        
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>New Appointment Booked - Wi Help</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #fbfbfb;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,57,74,0.1);"">
        <div style=""background: linear-gradient(135deg, #00394a 0%, #00546e 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #00e984; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: 1px;"">Wi Help</h1>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;"">New Appointment Booked</p>
            <p style=""color: #14d3ac; margin: 8px 0 0 0; font-size: 14px;"">Healthcare at Your Doorstep</p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #00394a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">Hi <strong style=""color: #00546e;"">{professionalName}</strong>,</p>
            <p style=""font-size: 16px; margin: 0 0 15px 0;"">Great news! A patient has requested an appointment with you.</p>
            <p style=""font-size: 16px; margin: 0 0 30px 0; color: #00546e;"">Please review the details below and respond to the appointment request.</p>
            <div style=""background-color: #e6f9f5; padding: 25px; border-radius: 12px; border: 2px solid #14d3ac; margin: 30px 0;"">
                <h2 style=""color: #00394a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #14d3ac; padding-bottom: 10px;"">📋 Appointment Details</h2>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">👤 Patient:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{patientName}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📧 Email:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{patientEmail}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📱 Phone:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{patientPhone}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📅 Date:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{formattedStartDate}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">🕐 Time:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{formattedStartTime} - {formattedEndTime} ({duration:F1} hours)</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">⚡ Urgency:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{urgency}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">💰 Price:</p><p style=""margin: 0; font-size: 16px; color: #00394a; font-weight: 600;"">{formattedPrice}</p></div>
                {notesSection}
            </div>
            <div style=""margin: 30px 0; padding: 20px; background-color: #ffecb4; border-radius: 8px; border-left: 4px solid #00e984;"">
                <p style=""margin: 0; font-size: 14px; color: #00394a;"">🔔 <strong>Action Required:</strong> Log in to your Wi Help dashboard to accept or decline this appointment request.</p>
            </div>
        </div>
        <div style=""background-color: #00394a; padding: 30px; text-align: center;"">
            <p style=""color: #00e984; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">Best regards,</p>
            <p style=""color: #14d3ac; margin: 0; font-size: 14px;"">The Wi Help Team</p>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 12px; font-style: italic;"">Providing Healthcare to Patients at Home</p>
        </div>
    </div>
</body>
</html>";
    }

    public static string AppointmentAccepted(
        string patientName,
        string professionalName,
        string professionalEmail,
        string professionalPhone,
        string specialization,
        DateTime startDate,
        DateTime endDate,
        string urgency,
        decimal price,
        string? notes)
    {
        // Convert UTC times to local timezone (Tunisia)
        var localStartDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
        var localEndDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(endDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
            
        var formattedStartDate = localStartDate.ToString("dddd, MMMM dd, yyyy");
        var formattedStartTime = localStartDate.ToString("hh:mm tt");
        var formattedEndTime = localEndDate.ToString("hh:mm tt");
        var duration = (localEndDate - localStartDate).TotalHours;
        var formattedPrice = $"{price:F2} TND";
        
        var notesSection = string.IsNullOrWhiteSpace(notes) ? "" : $@"
                <div style=""margin-bottom: 0;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📝 Notes:</p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a; font-style: italic;"">{notes}</p>
                </div>";
        
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Appointment Accepted - Wi Help</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #fbfbfb;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,57,74,0.1);"">
        <div style=""background: linear-gradient(135deg, #00394a 0%, #00546e 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #00e984; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: 1px;"">Wi Help</h1>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;"">✅ Appointment Accepted!</p>
            <p style=""color: #14d3ac; margin: 8px 0 0 0; font-size: 14px;"">Healthcare at Your Doorstep</p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #00394a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">Hi <strong style=""color: #00546e;"">{patientName}</strong>,</p>
            <p style=""font-size: 16px; margin: 0 0 15px 0;"">Excellent news! <strong style=""color: #00546e;"">{professionalName}</strong> has accepted your appointment request.</p>
            <p style=""font-size: 16px; margin: 0 0 30px 0; color: #00546e;"">Your appointment is confirmed and your healthcare professional is ready to help you.</p>
            <div style=""background-color: #e6f9f5; padding: 25px; border-radius: 12px; border: 2px solid #14d3ac; margin: 30px 0;"">
                <h2 style=""color: #00394a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #14d3ac; padding-bottom: 10px;"">📋 Appointment Details</h2>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">👨‍⚕️ Professional:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{professionalName}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">🩺 Specialization:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{specialization}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📧 Email:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{professionalEmail}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📱 Phone:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{professionalPhone}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">📅 Date:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{formattedStartDate}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">🕐 Time:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{formattedStartTime} - {formattedEndTime} ({duration:F1} hours)</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">⚡ Urgency:</p><p style=""margin: 0; font-size: 16px; color: #00394a;"">{urgency}</p></div>
                <div style=""margin-bottom: 15px;""><p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">💰 Price:</p><p style=""margin: 0; font-size: 16px; color: #00394a; font-weight: 600;"">{formattedPrice}</p></div>
                {notesSection}
            </div>
            <div style=""margin: 30px 0; padding: 20px; background-color: #ffecb4; border-radius: 8px; border-left: 4px solid #00e984;"">
                <p style=""margin: 0; font-size: 14px; color: #00394a;"">📱 <strong>What's Next?</strong> Log in to your Wi Help dashboard to chat with your professional or manage your appointment.</p>
            </div>
        </div>
        <div style=""background-color: #00394a; padding: 30px; text-align: center;"">
            <p style=""color: #00e984; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">Best regards,</p>
            <p style=""color: #14d3ac; margin: 0; font-size: 14px;"">The Wi Help Team</p>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 12px; font-style: italic;"">Providing Healthcare to Patients at Home</p>
        </div>
    </div>
</body>
</html>";
    }

    public static string AppointmentRejected(string patientName, string professionalName, DateTime startDate, DateTime endDate, string urgency, decimal price)
    {
        // Convert UTC times to local timezone (Tunisia)
        var localStartDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
        var localEndDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(endDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
            
        var formattedStartDate = localStartDate.ToString("dddd, MMMM dd, yyyy");
        var formattedStartTime = localStartDate.ToString("hh:mm tt");
        var formattedEndTime = localEndDate.ToString("hh:mm tt");
        var duration = (localEndDate - localStartDate).TotalHours;
        var formattedPrice = $"{price:F2} TND";
        
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Appointment Update - Wi Help</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #fbfbfb;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,57,74,0.1);"">
        <div style=""background: linear-gradient(135deg, #00394a 0%, #00546e 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #00e984; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: 1px;"">
                Wi Help
            </h1>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;"">
                Appointment Update
            </p>
            <p style=""color: #14d3ac; margin: 8px 0 0 0; font-size: 14px;"">
                Healthcare at Your Doorstep
            </p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #00394a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">
                Hi <strong style=""color: #00546e;"">{patientName}</strong>,
            </p>
            <p style=""font-size: 16px; margin: 0 0 15px 0;"">
                We wanted to inform you that <strong style=""color: #00546e;"">{professionalName}</strong> is unable to accept your appointment request at this time.
            </p>
            <p style=""font-size: 16px; margin: 0 0 30px 0; color: #00546e;"">
                Don't worry - there are many other qualified professionals available on Wi Help who can help you!
            </p>
            <div style=""background-color: #fbfbfb; padding: 25px; border-radius: 12px; border: 2px solid #e0e0e0; margin: 30px 0;"">
                <h2 style=""color: #00394a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;"">
                    📋 Original Request Details
                </h2>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        👨‍⚕️ Professional:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {professionalName}
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        📅 Date:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {formattedStartDate}
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        🕐 Time:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {formattedStartTime} - {formattedEndTime} ({duration:F1} hours)
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        ⚡ Urgency:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {urgency}
                    </p>
                </div>
                <div style=""margin-bottom: 0;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        💰 Price:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a; font-weight: 600;"">
                        {formattedPrice}
                    </p>
                </div>
            </div>
            <div style=""margin: 30px 0; padding: 20px; background-color: #e6f9f5; border-radius: 8px; border-left: 4px solid #14d3ac;"">
                <p style=""margin: 0; font-size: 14px; color: #00394a;"">
                    💡 <strong>Tip:</strong> Browse other professionals in the same specialization on your Wi Help dashboard to find the perfect match for your healthcare needs.
                </p>
            </div>
        </div>
        <div style=""background-color: #00394a; padding: 30px; text-align: center;"">
            <p style=""color: #00e984; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">
                Best regards,
            </p>
            <p style=""color: #14d3ac; margin: 0; font-size: 14px;"">
                The Wi Help Team
            </p>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 12px; font-style: italic;"">
                Providing Healthcare to Patients at Home
            </p>
        </div>
    </div>
</body>
</html>";
    }

    public static string AppointmentCancelledByProfessional(string patientName, string professionalName, DateTime startDate, DateTime endDate, string urgency, decimal price, string? notes)
    {
        // Convert UTC times to local timezone (Tunisia)
        var localStartDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
        var localEndDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(endDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
            
        var formattedStartDate = localStartDate.ToString("dddd, MMMM dd, yyyy");
        var formattedStartTime = localStartDate.ToString("hh:mm tt");
        var formattedEndTime = localEndDate.ToString("hh:mm tt");
        var duration = (localEndDate - localStartDate).TotalHours;
        var formattedPrice = $"{price:F2} TND";
        
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Appointment Cancelled - Wi Help</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #fbfbfb;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,57,74,0.1);"">
        <div style=""background: linear-gradient(135deg, #00394a 0%, #00546e 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #00e984; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: 1px;"">
                Wi Help
            </h1>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;"">
                Appointment Cancelled
            </p>
            <p style=""color: #14d3ac; margin: 8px 0 0 0; font-size: 14px;"">
                Healthcare at Your Doorstep
            </p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #00394a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">
                Hi <strong style=""color: #00546e;"">{patientName}</strong>,
            </p>
            <p style=""font-size: 16px; margin: 0 0 15px 0;"">
                We're writing to inform you that <strong style=""color: #00546e;"">{professionalName}</strong> has had to cancel your upcoming appointment.
            </p>
            <p style=""font-size: 16px; margin: 0 0 30px 0; color: #00546e;"">
                We apologize for any inconvenience this may cause. You can book a new appointment with another professional or reschedule for a different time.
            </p>
            <div style=""background-color: #fff3f3; padding: 25px; border-radius: 12px; border: 2px solid #ffb3b3; margin: 30px 0;"">
                <h2 style=""color: #00394a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #ffb3b3; padding-bottom: 10px;"">
                    ❌ Cancelled Appointment Details
                </h2>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        👨‍⚕️ Professional:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {professionalName}
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        📅 Date:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {formattedStartDate}
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        🕐 Time:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {formattedStartTime} - {formattedEndTime} ({duration:F1} hours)
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        ⚡ Urgency:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {urgency}
                    </p>
                </div>
                <div style=""margin-bottom: 0;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        💰 Price:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a; font-weight: 600;"">
                        {formattedPrice}
                    </p>
                </div>
            </div>
            <div style=""margin: 30px 0; padding: 20px; background-color: #e6f9f5; border-radius: 8px; border-left: 4px solid #14d3ac;"">
                <p style=""margin: 0; font-size: 14px; color: #00394a;"">
                    💡 <strong>What's Next?</strong> Log in to your Wi Help dashboard to find another qualified professional or reschedule your appointment.
                </p>
            </div>
        </div>
        <div style=""background-color: #00394a; padding: 30px; text-align: center;"">
            <p style=""color: #00e984; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">
                Best regards,
            </p>
            <p style=""color: #14d3ac; margin: 0; font-size: 14px;"">
                The Wi Help Team
            </p>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 12px; font-style: italic;"">
                Providing Healthcare to Patients at Home
            </p>
        </div>
    </div>
</body>
</html>";
    }

    public static string AppointmentCancelledByPatient(string professionalName, string patientName, DateTime startDate, DateTime endDate, string urgency, decimal price)
    {
        // Convert UTC times to local timezone (Tunisia)
        var localStartDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
        var localEndDate = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(endDate, DateTimeKind.Utc),
            TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis"));
            
        var formattedStartDate = localStartDate.ToString("dddd, MMMM dd, yyyy");
        var formattedStartTime = localStartDate.ToString("hh:mm tt");
        var formattedEndTime = localEndDate.ToString("hh:mm tt");
        var duration = (localEndDate - localStartDate).TotalHours;
        var formattedPrice = $"{price:F2} TND";
        
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Appointment Cancelled - Wi Help</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #fbfbfb;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,57,74,0.1);"">
        <div style=""background: linear-gradient(135deg, #00394a 0%, #00546e 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #00e984; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: 1px;"">
                Wi Help
            </h1>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;"">
                Appointment Cancelled
            </p>
            <p style=""color: #14d3ac; margin: 8px 0 0 0; font-size: 14px;"">
                Healthcare at Your Doorstep
            </p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #00394a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">
                Hi <strong style=""color: #00546e;"">{professionalName}</strong>,
            </p>
            <p style=""font-size: 16px; margin: 0 0 15px 0;"">
                We're writing to inform you that <strong style=""color: #00546e;"">{patientName}</strong> has cancelled their appointment with you.
            </p>
            <p style=""font-size: 16px; margin: 0 0 30px 0; color: #00546e;"">
                This appointment slot is now available for other patients who may need your services.
            </p>
            <div style=""background-color: #fff3f3; padding: 25px; border-radius: 12px; border: 2px solid #ffb3b3; margin: 30px 0;"">
                <h2 style=""color: #00394a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #ffb3b3; padding-bottom: 10px;"">
                    ❌ Cancelled Appointment Details
                </h2>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        👤 Patient:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {patientName}
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        📅 Date:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {formattedStartDate}
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        🕐 Time:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {formattedStartTime} - {formattedEndTime} ({duration:F1} hours)
                    </p>
                </div>
                <div style=""margin-bottom: 15px;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        ⚡ Urgency:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a;"">
                        {urgency}
                    </p>
                </div>
                <div style=""margin-bottom: 0;"">
                    <p style=""margin: 0 0 5px 0; font-size: 14px; color: #00546e; font-weight: 600;"">
                        💰 Price:
                    </p>
                    <p style=""margin: 0; font-size: 16px; color: #00394a; font-weight: 600;"">
                        {formattedPrice}
                    </p>
                </div>
            </div>
            <div style=""margin: 30px 0; padding: 20px; background-color: #e6f9f5; border-radius: 8px; border-left: 4px solid #14d3ac;"">
                <p style=""margin: 0; font-size: 14px; color: #00394a;"">
                    📅 <strong>Time Slot Available:</strong> This time slot is now free in your schedule and can be booked by other patients.
                </p>
            </div>
        </div>
        <div style=""background-color: #00394a; padding: 30px; text-align: center;"">
            <p style=""color: #00e984; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">
                Best regards,
            </p>
            <p style=""color: #14d3ac; margin: 0; font-size: 14px;"">
                The Wi Help Team
            </p>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 12px; font-style: italic;"">
                Providing Healthcare to Patients at Home
            </p>
        </div>
    </div>
</body>
</html>";
    }
}
