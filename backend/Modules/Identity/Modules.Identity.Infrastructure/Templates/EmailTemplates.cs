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
    <title>Reset Your Password - Wi Help</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #fbfbfb;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,57,74,0.1);"">
        <div style=""background: linear-gradient(135deg, #00394a 0%, #00546e 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #00e984; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: 1px;"">
                Wi Help
            </h1>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;"">Password Reset Request</p>
            <p style=""color: #14d3ac; margin: 8px 0 0 0; font-size: 14px;"">Healthcare at Your Doorstep</p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #00394a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">Hi <strong style=""color: #00546e;"">{userName}</strong>,</p>
            <p style=""font-size: 16px; margin: 0 0 15px 0;"">We received a request to reset your password for your <strong style=""color: #00546e;"">Wi Help</strong> account.</p>
            <p style=""font-size: 16px; margin: 0 0 30px 0; color: #00546e;"">Click the button below to create a new password and get back to accessing quality healthcare at home.</p>
            <div style=""text-align: center; margin: 40px 0;"">
                <a href=""{resetLink}"" style=""background: linear-gradient(135deg, #14d3ac 0%, #00e984 100%); color: #00394a; padding: 16px 40px; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(20, 211, 172, 0.3);"">
                    🔑 Reset Password
                </a>
            </div>
            <div style=""background-color: #fbfbfb; padding: 20px; border-radius: 8px; border-left: 4px solid #3fa6ff; margin: 30px 0;"">
                <p style=""margin: 0 0 10px 0; font-size: 14px; color: #00546e;""><strong>Button not working?</strong> Copy and paste this link:</p>
                <p style=""margin: 0; word-break: break-all;""><a href=""{resetLink}"" style=""color: #3fa6ff; text-decoration: none; font-size: 14px;"">{resetLink}</a></p>
            </div>
            <div style=""margin: 30px 0; padding: 15px; background-color: #ffecb4; border-radius: 6px; border: 1px solid #00e984;"">
                <p style=""margin: 0; font-size: 14px; color: #00394a;"">🔒 <strong>Security Note:</strong> If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
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

    public static string EmailConfirmation(string userName, string confirmationLink)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Welcome to Wi Help</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #fbfbfb;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,57,74,0.1);"">
        <div style=""background: linear-gradient(135deg, #00394a 0%, #00546e 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #00e984; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: 1px;"">
                Wi Help
            </h1>
            <p style=""color: #ffecb4; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;"">Welcome to Our Community!</p>
            <p style=""color: #14d3ac; margin: 8px 0 0 0; font-size: 14px;"">Healthcare at Your Doorstep</p>
        </div>
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #00394a;"">
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">Hi <strong style=""color: #00546e;"">{userName}</strong>,</p>
            <p style=""font-size: 16px; margin: 0 0 15px 0;"">Thank you for joining <strong style=""color: #00546e;"">Wi Help</strong>! We're excited to help you access quality healthcare from the comfort of your home.</p>
            <p style=""font-size: 16px; margin: 0 0 30px 0; color: #00546e;"">To get started, please confirm your email address by clicking the button below:</p>
            <div style=""text-align: center; margin: 40px 0;"">
                <a href=""{confirmationLink}"" style=""background: linear-gradient(135deg, #14d3ac 0%, #00e984 100%); color: #00394a; padding: 16px 40px; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(20, 211, 172, 0.3);"">
                    ✓ Confirm Your Email
                </a>
            </div>
            <div style=""background-color: #fbfbfb; padding: 20px; border-radius: 8px; border-left: 4px solid #3fa6ff; margin: 30px 0;"">
                <p style=""margin: 0 0 10px 0; font-size: 14px; color: #00546e;""><strong>Button not working?</strong> Copy and paste this link:</p>
                <p style=""margin: 0; word-break: break-all;""><a href=""{confirmationLink}"" style=""color: #3fa6ff; text-decoration: none; font-size: 14px;"">{confirmationLink}</a></p>
            </div>
            <div style=""margin: 30px 0; padding: 20px; background-color: #e6f9f5; border-radius: 8px; border: 2px solid #14d3ac;"">
                <p style=""margin: 0 0 15px 0; font-size: 16px; color: #00394a; font-weight: 600;"">🏥 What You Can Do with Wi Help:</p>
                <ul style=""margin: 0; padding-left: 20px; color: #00546e; font-size: 14px;"">
                    <li style=""margin-bottom: 8px;"">Book professional healthcare services at home</li>
                    <li style=""margin-bottom: 8px;"">Connect with qualified healthcare providers</li>
                    <li style=""margin-bottom: 8px;"">Manage your appointments seamlessly</li>
                    <li style=""margin-bottom: 0;"">Access healthcare support anytime, anywhere</li>
                </ul>
            </div>
            <div style=""margin: 30px 0; padding: 15px; background-color: #ffecb4; border-radius: 6px; border: 1px solid #00e984;"">
                <p style=""margin: 0; font-size: 14px; color: #00394a;"">🔒 <strong>Security Note:</strong> If you didn't create this account, you can safely ignore this email.</p>
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
}
