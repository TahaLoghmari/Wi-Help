# SignalR Real-Time Notifications - Implementation Guide

## Overview

This document outlines the SignalR real-time notification implementation and best practices for the Wi-Help application.

## Key Issues Fixed

### 1. **User ID Mapping (Critical Fix)**

**Problem**: SignalR couldn't correctly identify users because it was using the default `ClaimsPrincipal.Identity.Name`, but the JWT tokens use the `sub` claim.

**Solution**: Created a custom `IUserIdProvider` that maps the JWT `sub` claim to SignalR's user identifier.

**Important**: SignalR uses `UserId` (the `sub` claim in JWT) to identify users, NOT entity IDs like `ProfessionalId` or `PatientId`. Always convert entity IDs to UserIds before sending notifications.

**File**: `Modules/Notifications/Modules.Notifications.Infrastructure/UserIdProvider.cs`

### 2. **JWT Authentication for SignalR**

**Problem**: SignalR WebSocket connections need proper JWT token handling.

**Solution**:

- Enhanced JWT Bearer configuration to support tokens from both cookies (HTTP) and query strings (WebSocket)
- SignalR automatically uses cookies when `withCredentials: true` is set in the frontend

**File**: `backend.Host/DependencyInjection.cs` (AddAuthentication method)

### 3. **Connection Management**

**Problem**: Frontend lacked proper connection state management and error handling.

**Solution**:

- Added automatic reconnection with exponential backoff
- Added connection state logging
- Improved error handling and connection lifecycle management

**File**: `frontend/src/providers/SignalRProvider.tsx`

### 4. **Notification Delivery**

**Problem**: Missing notifications when professionals respond to appointments.

**Solution**: Added notification sending in `RespondToAppointmentCommandHandler` to notify patients when appointments are accepted/rejected.

**File**: `Modules/Appointments/Modules.Appointments.Features/RespondToAppointment/RespondToAppointmentCommandHandler.cs`

## Architecture

### Backend Components

1. **NotificationHub** (`Modules/Notifications/Modules.Notifications.Infrastructure/NotificationHub.cs`)

   - Authorized SignalR hub
   - Handles connection lifecycle events
   - Logs connection/disconnection events

2. **UserIdProvider** (`Modules/Notifications/Modules.Notifications.Infrastructure/UserIdProvider.cs`)

   - Maps JWT `sub` claim to SignalR user identifier
   - Critical for targeted user notifications

3. **NotificationsService** (`Modules/Notifications/Modules.Notifications.Infrastructure/Services/NotificationsService.cs`)

   - Sends notifications to specific users via SignalR
   - Uses `hubContext.Clients.User(userId)` for targeted delivery
   - Includes error handling and logging

4. **NotificationsModuleApi** (`Modules/Notifications/Modules.Notifications.Features/NotificationsModuleApi.cs`)
   - Creates notification records in database
   - Triggers real-time delivery via NotificationsService

### Frontend Components

1. **SignalRProvider** (`frontend/src/providers/SignalRProvider.tsx`)
   - Manages SignalR connection lifecycle
   - Handles automatic reconnection
   - Listens for `NotificationReceived` events
   - Invalidates React Query cache on notification receipt

## How It Works

### Flow: Patient Books Appointment → Professional Receives Notification

1. **Patient books appointment** via `BookAppointmentCommandHandler`
2. **Handler creates appointment** in database
3. **Handler fetches professional** information
4. **Handler calls** `notificationsModuleApi.AddNotificationAsync()` with professional's `UserId`
5. **NotificationsModuleApi**:
   - Creates notification record in database
   - Calls `notificationsService.SendToUser()` with professional's `UserId`
6. **NotificationsService**:
   - Uses `hubContext.Clients.User(userId)` to send to specific user
   - SignalR uses `UserIdProvider` to map `userId` to connected client
   - Sends `NotificationReceived` event to frontend
7. **Frontend SignalRProvider**:
   - Receives `NotificationReceived` event
   - Shows toast notification
   - Invalidates relevant React Query cache
   - Professional's appointments list updates automatically

## Best Practices

### Backend

1. **Always use UserIdProvider**

   - SignalR needs to know how to map JWT claims to user identifiers
   - Without it, `Clients.User(userId)` won't work correctly

2. **Use UserId, NOT Entity IDs for notifications**

   - SignalR identifies users by `UserId` (the `sub` claim in JWT)
   - Do NOT use `ProfessionalId` or `PatientId` directly
   - Always convert entity IDs to UserIds using the appropriate API (e.g., `GetProfessionalsByIdsAsync` → `ProfessionalDto.UserId`)
   - The JWT token contains `ProfessionalId`/`PatientId` claims for authorization, but SignalR uses `UserId` for routing

3. **Use `Clients.User(userId)` for targeted notifications**

   - More secure than `Clients.All`
   - Only sends to authenticated users
   - Works across multiple tabs/devices for the same user

4. **Store notifications in database first**

   - Ensures notifications persist even if user is offline
   - Allows users to view notification history
   - Enables read/unread status tracking

5. **Add logging to SignalR hub**

   - Helps debug connection issues
   - Monitor user connections/disconnections
   - Track notification delivery

6. **Handle errors gracefully**
   - Wrap notification sending in try-catch
   - Log errors but don't fail the main operation
   - Consider retry logic for critical notifications

### Frontend

1. **Use automatic reconnection**

   - SignalR connections can drop due to network issues
   - Configure exponential backoff for reconnection attempts
   - Handle reconnection events to show user feedback

2. **Invalidate React Query cache on notifications**

   - Ensures UI updates immediately when notifications arrive
   - Use specific query keys for targeted cache invalidation
   - Consider optimistic updates for better UX

3. **Handle connection state**

   - Show connection status to users if needed
   - Handle connection failures gracefully
   - Provide feedback during reconnection

4. **Use `withCredentials: true`**

   - Required for cookie-based authentication
   - Ensures JWT token is sent with SignalR connection

5. **Clean up connections**
   - Stop SignalR connection in useEffect cleanup
   - Prevent memory leaks
   - Avoid multiple connections

## Testing Checklist

- [ ] Patient books appointment → Professional receives notification
- [ ] Professional accepts appointment → Patient receives notification
- [ ] Professional rejects appointment → Patient receives notification
- [ ] Notifications work across multiple tabs for same user
- [ ] Notifications work after page refresh
- [ ] Connection reconnects automatically after network interruption
- [ ] Notifications persist in database
- [ ] UI updates automatically when notifications arrive

## Common Issues and Solutions

### Issue: Notifications not received

**Possible causes:**

1. **User ID mismatch** - Check `UserIdProvider` is correctly mapping JWT claims
2. **Using Entity ID instead of UserId** - Ensure you're using `UserId` (from `sub` claim), not `ProfessionalId` or `PatientId`
3. User not connected - Check SignalR connection is established
4. Wrong user ID - Verify the `userId` passed to `SendToUser()` matches the JWT `sub` claim

**Common mistake**: Using `ProfessionalId.ToString()` or `PatientId.ToString()` instead of `professional.UserId.ToString()` or `patient.UserId.ToString()`

**Debug steps:**

1. Check backend logs for connection events
2. Verify JWT token contains correct `sub` claim
3. Check browser console for SignalR connection status
4. Verify `UserIdProvider.GetUserId()` returns correct value

### Issue: Connection fails

**Possible causes:**

1. CORS configuration - Ensure SignalR endpoint is included in CORS policy
2. Authentication - Verify JWT token is valid and sent correctly
3. Cookie issues - Check `SameSite` and `Secure` flags match environment

**Debug steps:**

1. Check browser network tab for WebSocket connection
2. Verify cookies are being sent
3. Check backend authentication logs
4. Test with Postman/curl to verify endpoint accessibility

### Issue: Multiple notifications

**Possible causes:**

1. Multiple SignalR connections - Check connection cleanup
2. Event handler registered multiple times - Ensure useEffect dependencies are correct

**Debug steps:**

1. Check browser console for connection count
2. Verify useEffect cleanup function is called
3. Check for duplicate event handlers

## Security Considerations

1. **Authorization**: SignalR hub uses `[Authorize]` attribute - only authenticated users can connect
2. **User targeting**: Always use `Clients.User(userId)` - never broadcast sensitive data to all users
3. **Token validation**: JWT tokens are validated on every connection
4. **HTTPS**: Use HTTPS in production to protect WebSocket connections

## Performance Considerations

1. **Connection pooling**: SignalR manages connections efficiently
2. **Message size**: Keep notification payloads small
3. **Database queries**: Batch notification creation when possible
4. **Cache invalidation**: Be selective about which queries to invalidate

## Future Enhancements

1. **Notification groups**: Support for group-based notifications (e.g., all professionals in a clinic)
2. **Notification preferences**: Allow users to configure notification types
3. **Push notifications**: Integrate with browser push API for offline notifications
4. **Notification history**: UI for viewing past notifications
5. **Read receipts**: Track when notifications are read
6. **Notification batching**: Batch multiple notifications into single delivery
