using Modules.Common.Features.Abstractions;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features.GetConversations;

public record GetConversationsQuery(Guid UserId) : IQuery<List<ConversationDto>>;

