using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.EditReply;

public sealed record EditReplyCommand(
    Guid ReviewId,
    Guid ReplyId,
    Guid CallerUserId,
    bool IsAdmin,
    string Comment) : ICommand;
