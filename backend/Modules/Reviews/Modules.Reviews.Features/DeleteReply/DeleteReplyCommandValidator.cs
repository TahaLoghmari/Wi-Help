using FluentValidation;

namespace Modules.Reviews.Features.DeleteReply;

public class DeleteReplyCommandValidator : AbstractValidator<DeleteReplyCommand>
{
    public DeleteReplyCommandValidator()
    {
        RuleFor(x => x.ReviewId).NotEmpty();
        RuleFor(x => x.ReplyId).NotEmpty();
        RuleFor(x => x.CallerUserId).NotEmpty();
    }
}
