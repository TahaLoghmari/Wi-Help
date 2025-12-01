using FluentValidation;

namespace Modules.Messaging.Features.SendMessage;

public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    public SendMessageCommandValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Message content cannot be empty")
            .MaximumLength(5000).WithMessage("Message content cannot exceed 5000 characters")
            .Must(content => !string.IsNullOrWhiteSpace(content))
            .WithMessage("Message content cannot be only whitespace");
            
        RuleFor(x => x.ConversationId)
            .NotEmpty().WithMessage("Conversation ID is required");
            
        RuleFor(x => x.SenderId)
            .NotEmpty().WithMessage("Sender ID is required");
    }
}
