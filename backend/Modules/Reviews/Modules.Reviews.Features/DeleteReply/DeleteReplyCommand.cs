using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.DeleteReply;

public sealed record DeleteReplyCommand(
    Guid ReviewId,
    Guid ReplyId,
    Guid CallerUserId,
    bool IsAdmin) : ICommand;
