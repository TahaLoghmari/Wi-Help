using FluentValidation;

namespace Modules.Messaging.Features.GetMessages;

public class GetMessagesQueryValidator : AbstractValidator<GetMessagesQuery>
{
    public GetMessagesQueryValidator()
    {
        RuleFor(x => x.ConversationId)
            .NotEmpty().WithMessage("Conversation ID is required");
            
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
            
        RuleFor(x => x.PageNumber)
            .GreaterThan(0).WithMessage("Page number must be greater than 0");
            
        RuleFor(x => x.PageSize)
            .GreaterThan(0).WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot exceed 100");
    }
}
