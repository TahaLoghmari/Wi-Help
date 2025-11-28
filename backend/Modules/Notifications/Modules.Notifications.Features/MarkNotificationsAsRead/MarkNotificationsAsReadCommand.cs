using Modules.Common.Features.Abstractions;

namespace Modules.Notifications.Features.MarkNotificationsAsRead;

public sealed record MarkNotificationsAsReadCommand(string UserId) : ICommand;