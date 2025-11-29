namespace Modules.Messaging.Features;

public static class MessagingEndpoints
{
    public const string CreateConversation = "messaging/conversations";
    public const string GetConversations = "messaging/conversations";
    public const string GetConversationById = "messaging/conversations/{conversationId}";
    public const string GetMessages = "messaging/conversations/{conversationId}/messages";
    public const string SendMessage = "messaging/conversations/{conversationId}/messages";
    public const string MarkMessagesAsRead = "messaging/conversations/{conversationId}/messages/read";
    public const string MarkMessagesAsDelivered = "messaging/conversations/{conversationId}/messages/delivered";
    public const string DeleteMessage = "messaging/messages/{messageId}";
}

