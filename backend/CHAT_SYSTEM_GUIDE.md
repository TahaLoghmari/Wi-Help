# Chat System Architecture Guide

## Overview

This document provides a comprehensive guide to the production-ready chat system implemented for the Wi-Help backend. The system enables real-time communication between professionals and patients using SignalR for all real-time functionality.

## High-Level Architecture

The chat system follows the existing modular architecture pattern:

```
Modules/Messaging/
├── Modules.Messaging.Domain/          # Domain entities and enums
│   ├── Entities/
│   │   ├── Conversation.cs
│   │   └── Message.cs
│   └── Enums/
│       ├── MessageStatus.cs
│       └── ConversationType.cs
├── Modules.Messaging.Features/        # Application features (commands/queries)
│   ├── CreateConversation/
│   ├── SendMessage/
│   ├── GetConversations/
│   ├── GetMessages/
│   ├── MarkMessagesAsRead/
│   ├── MarkMessagesAsDelivered/
│   └── DeleteMessage/
├── Modules.Messaging.Infrastructure/  # Infrastructure (database, SignalR)
│   ├── Database/
│   ├── ChatHub.cs
│   ├── ConnectionTracker.cs
│   └── Jobs/
└── Modules.Messaging.PublicApi/       # Public API contracts
    └── Contracts/
```

## Data Models and Database Schema

### Entities

#### Conversation
- **Id**: Guid (Primary Key)
- **Participant1Id**: Guid (UserId)
- **Participant2Id**: Guid (UserId)
- **Type**: ConversationType enum
- **CreatedAt**: DateTime
- **UpdatedAt**: DateTime
- **LastMessageAt**: DateTime? (nullable)

**Schema**: `messaging.conversations`

#### Message
- **Id**: Guid (Primary Key)
- **ConversationId**: Guid (Foreign Key)
- **SenderId**: Guid (UserId)
- **Content**: string (max 5000 characters)
- **Status**: MessageStatus enum (Sent, Delivered, Read)
- **CreatedAt**: DateTime
- **DeliveredAt**: DateTime? (nullable)
- **ReadAt**: DateTime? (nullable)
- **DeletedAt**: DateTime? (nullable, soft delete)

**Schema**: `messaging.messages`

### Enums

```csharp
public enum MessageStatus
{
    Sent = 0,
    Delivered = 1,
    Read = 2
}

public enum ConversationType
{
    ProfessionalPatient = 0
}
```

### Database Indexes

- `conversations`: Indexed on `(Participant1Id, Participant2Id)` and `(Participant2Id, Participant1Id)` for efficient lookup
- `messages`: Indexed on `ConversationId`, `SenderId`, `CreatedAt`, and `(ConversationId, CreatedAt)` for efficient querying

## API Endpoints

All endpoints require authentication via JWT token.

### 1. Create Conversation

**POST** `/messaging/conversations`

Creates a new conversation between two participants. If a conversation already exists, returns the existing conversation ID.

**Request Body:**
```json
{
  "participant1Id": "guid",
  "participant2Id": "guid"
}
```

**Response:**
```json
{
  "conversationId": "guid"
}
```

**Example:**
```bash
curl -X POST https://api.example.com/messaging/conversations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "participant1Id": "123e4567-e89b-12d3-a456-426614174000",
    "participant2Id": "123e4567-e89b-12d3-a456-426614174001"
  }'
```

### 2. Get Conversations

**GET** `/messaging/conversations`

Retrieves all conversations for the authenticated user, ordered by last message time.

**Response:**
```json
[
  {
    "id": "guid",
    "otherParticipantId": "guid",
    "otherParticipantFirstName": "John",
    "otherParticipantLastName": "Doe",
    "otherParticipantProfilePictureUrl": "https://...",
    "lastMessage": {
      "id": "guid",
      "senderId": "guid",
      "content": "Hello!",
      "status": "Read",
      "createdAt": "2024-01-01T12:00:00Z",
      "deliveredAt": "2024-01-01T12:00:01Z",
      "readAt": "2024-01-01T12:00:05Z"
    },
    "unreadCount": 0,
    "lastActivityAt": "2024-01-01T12:00:00Z"
  }
]
```

### 3. Get Messages

**GET** `/messaging/conversations/{conversationId}/messages?pageNumber=1&pageSize=50`

Retrieves messages for a specific conversation with pagination.

**Query Parameters:**
- `pageNumber` (optional, default: 1)
- `pageSize` (optional, default: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": "guid",
      "senderId": "guid",
      "content": "Hello!",
      "status": "Read",
      "createdAt": "2024-01-01T12:00:00Z",
      "deliveredAt": "2024-01-01T12:00:01Z",
      "readAt": "2024-01-01T12:00:05Z"
    }
  ],
  "pageNumber": 1,
  "pageSize": 50,
  "totalCount": 100,
  "totalPages": 2
}
```

### 4. Send Message

**POST** `/messaging/conversations/{conversationId}/messages`

Sends a new message in a conversation.

**Request Body:**
```json
{
  "content": "Hello, how are you?"
}
```

**Response:**
```json
{
  "messageId": "guid"
}
```

### 5. Mark Messages as Read

**POST** `/messaging/conversations/{conversationId}/messages/read`

Marks all unread messages in a conversation as read.

**Response:** `200 OK`

### 6. Mark Messages as Delivered

**POST** `/messaging/conversations/{conversationId}/messages/delivered`

Marks all sent messages in a conversation as delivered.

**Response:** `200 OK`

### 7. Delete Message

**DELETE** `/messaging/messages/{messageId}`

Soft deletes a message (only the sender can delete their own messages).

**Response:** `200 OK`

## SignalR Implementation

### Hub Endpoint

**WebSocket URL**: `/hubs/chat`

**Connection:**
```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat", {
        accessTokenFactory: () => getAccessToken() // JWT token
    })
    .build();
```

### Hub Methods (Client → Server)

#### JoinConversation
Join a conversation group to receive real-time updates.

```javascript
await connection.invoke("JoinConversation", conversationId);
```

#### LeaveConversation
Leave a conversation group.

```javascript
await connection.invoke("LeaveConversation", conversationId);
```

#### StartTyping
Notify other participants that you're typing.

```javascript
await connection.invoke("StartTyping", conversationId);
```

#### StopTyping
Notify other participants that you stopped typing.

```javascript
await connection.invoke("StopTyping", conversationId);
```

### Hub Events (Server → Client)

#### MessageReceived
Triggered when a new message is received in a conversation.

```javascript
connection.on("MessageReceived", (message) => {
    console.log("New message:", message);
    // message: { messageId, conversationId, senderId, content, status, createdAt }
});
```

#### NewMessageNotification
Triggered when a new message is received (for notifications).

```javascript
connection.on("NewMessageNotification", (notification) => {
    console.log("New message notification:", notification);
    // notification: { conversationId, senderId, preview }
});
```

#### MessagesRead
Triggered when messages are marked as read.

```javascript
connection.on("MessagesRead", (data) => {
    console.log("Messages read:", data);
    // data: { conversationId, readBy }
});
```

#### MessagesDelivered
Triggered when messages are marked as delivered.

```javascript
connection.on("MessagesDelivered", (data) => {
    console.log("Messages delivered:", data);
    // data: { conversationId, deliveredBy }
});
```

#### MessageDeleted
Triggered when a message is deleted.

```javascript
connection.on("MessageDeleted", (data) => {
    console.log("Message deleted:", data);
    // data: { messageId, conversationId }
});
```

#### UserTyping
Triggered when another user is typing.

```javascript
connection.on("UserTyping", (conversationId, userId) => {
    console.log(`User ${userId} is typing in conversation ${conversationId}`);
});
```

#### UserStoppedTyping
Triggered when another user stopped typing.

```javascript
connection.on("UserStoppedTyping", (conversationId, userId) => {
    console.log(`User ${userId} stopped typing in conversation ${conversationId}`);
});
```

#### UserOnline
Triggered when a user comes online.

```javascript
connection.on("UserOnline", (userId) => {
    console.log(`User ${userId} is now online`);
});
```

#### UserOffline
Triggered when a user goes offline.

```javascript
connection.on("UserOffline", (userId) => {
    console.log(`User ${userId} is now offline`);
});
```

## Message Lifecycle

1. **Sent**: Message is created and saved to database with status `Sent`
2. **Delivered**: 
   - Automatically marked as delivered when recipient is online (via background job)
   - Can be manually marked via API endpoint
   - Status changes to `Delivered`, `DeliveredAt` timestamp is set
3. **Read**: 
   - Manually marked via API endpoint when user views the conversation
   - Status changes to `Read`, `ReadAt` timestamp is set
   - If not yet delivered, also sets `DeliveredAt`

## Typing Indicators

Typing indicators are implemented via SignalR:

1. Client calls `StartTyping(conversationId)` when user starts typing
2. Server broadcasts `UserTyping` event to other participants in the conversation
3. Client calls `StopTyping(conversationId)` when user stops typing
4. Server broadcasts `UserStoppedTyping` event

**Best Practice**: Implement a debounce mechanism on the client side to avoid excessive SignalR calls.

## Online/Offline Status

Online status is tracked via the `ConnectionTracker` service:

- **OnConnect**: User is added to online users, `UserOnline` event is broadcast
- **OnDisconnect**: User is removed from online users (if no other connections), `UserOffline` event is broadcast
- Multiple connections per user are supported (e.g., multiple devices)

## Security Considerations

### Authentication
- All endpoints require JWT authentication
- SignalR connections require JWT token (passed via query string: `?access_token=...`)
- User identity is extracted from the `sub` claim in the JWT token

### Authorization
- Users can only access conversations they are participants in
- Users can only delete their own messages
- Conversation creation requires the current user to be one of the participants

### Access Control
- All queries verify user participation before returning data
- Commands verify user permissions before execution
- Soft delete ensures message history is preserved for audit purposes

### Message Privacy
- Messages are only accessible to conversation participants
- Deleted messages are soft-deleted (not permanently removed)
- Message content is limited to 5000 characters

## Background Jobs

### Message Status Update Job

**Job Name**: `mark-messages-delivered`

**Schedule**: Runs every minute (Cron.MinuteInterval(1))

**Function**: Automatically marks messages as `Delivered` when the recipient is online.

**Implementation**: `MessageStatusUpdateJob.MarkMessagesAsDeliveredForOnlineUsers()`

## Recommended Folder Structure

```
Modules/Messaging/
├── Modules.Messaging.Domain/
│   ├── Entities/
│   │   ├── Conversation.cs
│   │   └── Message.cs
│   └── Enums/
│       ├── MessageStatus.cs
│       └── ConversationType.cs
├── Modules.Messaging.Features/
│   ├── CreateConversation/
│   │   ├── CreateConversationCommand.cs
│   │   ├── CreateConversationCommandHandler.cs
│   │   └── CreateConversation.cs
│   ├── SendMessage/
│   ├── GetConversations/
│   ├── GetMessages/
│   ├── MarkMessagesAsRead/
│   ├── MarkMessagesAsDelivered/
│   ├── DeleteMessage/
│   ├── MessagingEndpoints.cs
│   ├── MessagingModuleApi.cs
│   ├── DependencyInjection.cs
│   └── AssemblyReference.cs
├── Modules.Messaging.Infrastructure/
│   ├── Database/
│   │   ├── MessagingDbContext.cs
│   │   ├── DbConsts.cs
│   │   └── Configurations/
│   │       ├── ConversationConfiguration.cs
│   │       └── MessageConfiguration.cs
│   ├── Services/
│   │   └── ConnectionTracker.cs
│   ├── Jobs/
│   │   └── MessageStatusUpdateJob.cs
│   ├── ChatHub.cs
│   ├── UserIdProvider.cs
│   └── DependencyInjection.cs
└── Modules.Messaging.PublicApi/
    ├── IMessagingModuleApi.cs
    └── Contracts/
        ├── ConversationDto.cs
        ├── MessageDto.cs
        └── MessagesResponseDto.cs
```

## Database Migrations

To create and apply migrations:

```bash
# Create migration
dotnet ef migrations add InitialMessagingMigration --project Modules/Messaging/Modules.Messaging.Infrastructure --startup-project backend.Host

# Apply migration
dotnet ef database update --project Modules/Messaging/Modules.Messaging.Infrastructure --startup-project backend.Host
```

## Scalability Considerations

1. **Database Indexing**: All frequently queried fields are indexed
2. **Pagination**: Message retrieval supports pagination to handle large conversations
3. **SignalR Groups**: Efficient message broadcasting using SignalR groups
4. **Connection Tracking**: Singleton service for efficient online status tracking
5. **Background Jobs**: Automated message status updates reduce API calls

## Maintenance

### Monitoring
- Monitor SignalR connection counts
- Track message delivery rates
- Monitor background job execution

### Performance Optimization
- Consider caching frequently accessed conversations
- Implement message archiving for old conversations
- Monitor database query performance

## Example Client Implementation (TypeScript/React)

```typescript
import * as signalR from "@microsoft/signalr";

class ChatService {
    private connection: signalR.HubConnection;

    constructor(accessToken: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/hubs/chat", {
                accessTokenFactory: () => accessToken
            })
            .build();

        this.setupEventHandlers();
    }

    async connect(): Promise<void> {
        await this.connection.start();
    }

    async joinConversation(conversationId: string): Promise<void> {
        await this.connection.invoke("JoinConversation", conversationId);
    }

    async sendTyping(conversationId: string): Promise<void> {
        await this.connection.invoke("StartTyping", conversationId);
    }

    async stopTyping(conversationId: string): Promise<void> {
        await this.connection.invoke("StopTyping", conversationId);
    }

    private setupEventHandlers(): void {
        this.connection.on("MessageReceived", (message) => {
            // Handle new message
        });

        this.connection.on("UserTyping", (conversationId, userId) => {
            // Show typing indicator
        });

        this.connection.on("UserOnline", (userId) => {
            // Update user online status
        });
    }
}
```

## Summary

This chat system provides:
- ✅ Real-time messaging via SignalR
- ✅ Message lifecycle tracking (Sent → Delivered → Read)
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Secure access control
- ✅ Scalable architecture
- ✅ Background job automation
- ✅ Production-ready implementation

All components follow the existing backend architecture patterns and best practices.

