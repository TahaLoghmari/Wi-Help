using Modules.Common.Features.Abstractions;

namespace Modules.Notifications.Features.MarkNotificationAsRead;

public sealed record MarkNotificationAsReadCommand(Guid Id, string UserId) : ICommand;