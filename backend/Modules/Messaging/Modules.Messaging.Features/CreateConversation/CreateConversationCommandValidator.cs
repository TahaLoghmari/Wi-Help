using FluentValidation;

namespace Modules.Messaging.Features.CreateConversation;

public class CreateConversationCommandValidator : AbstractValidator<CreateConversationCommand>
{
    public CreateConversationCommandValidator()
    {
        RuleFor(x => x.Participant1Id)
            .NotEmpty().WithMessage("Participant 1 ID is required");
            
        RuleFor(x => x.Participant2Id)
            .NotEmpty().WithMessage("Participant 2 ID is required")
            .NotEqual(x => x.Participant1Id).WithMessage("Cannot create conversation with yourself");
    }
}
