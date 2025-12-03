using FluentValidation;

namespace Modules.Identity.Features.Auth.ChangePassword;

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(c => c.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required.");

        RuleFor(c => c.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(6).WithMessage("New password must be at least 6 characters long.")
            .MaximumLength(100).WithMessage("New password must be at most 100 characters long.")
            .Matches("[A-Z]").WithMessage("New password must contain at least one uppercase letter (A-Z).")
            .Matches("[a-z]").WithMessage("New password must contain at least one lowercase letter (a-z).")
            .Matches("[0-9]").WithMessage("New password must contain at least one digit (0-9).")
            .Matches("[^a-zA-Z0-9]").WithMessage("New password must contain at least one non-alphanumeric character.")
            .NotEqual(c => c.CurrentPassword).WithMessage("New password must be different from the current password.");
    }
}
