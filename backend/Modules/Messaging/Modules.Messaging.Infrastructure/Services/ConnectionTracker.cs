namespace Modules.Messaging.Infrastructure.Services;

/// <summary>
/// Tracks online users and their SignalR connection IDs
/// </summary>
public class ConnectionTracker
{
    private readonly Dictionary<string, HashSet<string>> _userConnections = new();
    private readonly object _lock = new();

    public void AddConnection(string userId, string connectionId)
    {
        lock (_lock)
        {
            if (!_userConnections.ContainsKey(userId))
            {
                _userConnections[userId] = new HashSet<string>();
            }
            _userConnections[userId].Add(connectionId);
        }
    }

    public void RemoveConnection(string userId, string connectionId)
    {
        lock (_lock)
        {
            if (_userConnections.TryGetValue(userId, out var connections))
            {
                connections.Remove(connectionId);
                if (connections.Count == 0)
                {
                    _userConnections.Remove(userId);
                }
            }
        }
    }

    public bool IsUserOnline(string userId)
    {
        lock (_lock)
        {
            return _userConnections.ContainsKey(userId) && _userConnections[userId].Count > 0;
        }
    }

    public HashSet<string> GetUserConnections(string userId)
    {
        lock (_lock)
        {
            return _userConnections.TryGetValue(userId, out var connections)
                ? new HashSet<string>(connections)
                : new HashSet<string>();
        }
    }

    public IReadOnlyList<string> GetOnlineUserIds()
    {
        lock (_lock)
        {
            return _userConnections.Keys.ToList();
        }
    }
}

