using FluentValidation;

namespace Modules.Reviews.Features.EditReply;

public class EditReplyCommandValidator : AbstractValidator<EditReplyCommand>
{
    public EditReplyCommandValidator()
    {
        RuleFor(x => x.ReviewId).NotEmpty();
        RuleFor(x => x.ReplyId).NotEmpty();
        RuleFor(x => x.CallerUserId).NotEmpty();
        RuleFor(x => x.Comment).NotEmpty().MaximumLength(2000);
    }
}
