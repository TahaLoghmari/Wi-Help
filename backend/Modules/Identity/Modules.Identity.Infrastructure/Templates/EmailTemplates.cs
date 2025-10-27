namespace Modules.Identity.Infrastructure.Templates;

public static class EmailTemplates
{
    public static string PasswordReset(string userName, string resetLink)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Reset Your Password</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f0f0f0;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"">
        <div style=""background: linear-gradient(135deg, #444 0%, #222 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 28px; font-weight: 300;"">
                Password Reset Request
            </h1>
            <p style=""color: #dddddd; margin: 10px 0 0 0; font-size: 16px;"">Let's get you back in</p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #1a1a1a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">Hi <strong style=""color: #444;"">{userName}</strong>,</p>
            <p style=""font-size: 16px; margin: 0 0 30px 0;"">We received a request to reset your password for your <strong>SmartPly</strong> account.</p>
            <div style=""text-align: center; margin: 40px 0;"">
                <a href=""{resetLink}"" style=""background: linear-gradient(135deg, #444 0%, #222 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);"">
                    🔑 Reset Password
                </a>
            </div>
            <div style=""background-color: #f0f0f0; padding: 20px; border-radius: 8px; border-left: 4px solid #444; margin: 30px 0;"">
                <p style=""margin: 0 0 10px 0; font-size: 14px; color: #555;""><strong>Button not working?</strong> Copy and paste this link:</p>
                <p style=""margin: 0; word-break: break-all;""><a href=""{resetLink}"" style=""color: #333; text-decoration: none; font-size: 14px;"">{resetLink}</a></p>
            </div>
            <div style=""margin: 30px 0; padding: 15px; background-color: #eeeeee; border-radius: 6px; border: 1px solid #cccccc;"">
                <p style=""margin: 0; font-size: 14px; color: #333;"">🔒 <strong>Security Note:</strong> If you didn't request this, you can safely ignore this email.</p>
            </div>
        </div>
        <div style=""background-color: #1a1a1a; padding: 30px; text-align: center;"">
            <p style=""color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">Best regards,</p>
            <p style=""color: #aaaaaa; margin: 0; font-size: 14px;"">The SmartPly Team</p>
        </div>
    </div>
</body>
</html>";
    }

    public static string EmailConfirmation(string userName, string confirmationLink)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Welcome to SmartPly</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f0f0f0;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"">
        <div style=""background: linear-gradient(135deg, #444444 0%, #222222 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 28px; font-weight: 300;"">
                Welcome to <strong>SmartPly</strong>
            </h1>
            <p style=""color: #dddddd; margin: 10px 0 0 0; font-size: 16px;"">Let's get you started</p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #1a1a1a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">Hi <strong style=""color: #444444;"">{userName}</strong>,</p>
            <p style=""font-size: 16px; margin: 0 0 30px 0;"">Thank you for creating an account with us! Please confirm your email address.</p>
            <div style=""text-align: center; margin: 40px 0;"">
                <a href=""{confirmationLink}"" style=""background: linear-gradient(135deg, #444444 0%, #222222 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);"">
                    ✓ Confirm Your Email
                </a>
            </div>
            <div style=""background-color: #f0f0f0; padding: 20px; border-radius: 8px; border-left: 4px solid #444444; margin: 30px 0;"">
                <p style=""margin: 0 0 10px 0; font-size: 14px; color: #555555;""><strong>Button not working?</strong> Copy and paste this link:</p>
                <p style=""margin: 0; word-break: break-all;""><a href=""{confirmationLink}"" style=""color: #333333; text-decoration: none; font-size: 14px;"">{confirmationLink}</a></p>
            </div>
            <div style=""margin: 30px 0; padding: 15px; background-color: #eeeeee; border-radius: 6px; border: 1px solid #cccccc;"">
                <p style=""margin: 0; font-size: 14px; color: #333333;"">🔒 <strong>Security Note:</strong> If you didn't create this account, you can safely ignore this email.</p>
            </div>
        </div>
        <div style=""background-color: #1a1a1a; padding: 30px; text-align: center;"">
            <p style=""color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">Best regards,</p>
            <p style=""color: #aaaaaa; margin: 0; font-size: 14px;"">The SmartPly Team</p>
        </div>
    </div>
</body>
</html>";
    }
}
