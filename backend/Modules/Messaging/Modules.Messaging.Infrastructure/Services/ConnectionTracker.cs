using System.Collections.Concurrent;

namespace Modules.Messaging.Infrastructure.Services;


public class ConnectionTracker
{
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _userConnections = new();
    private readonly object _lock = new();


    public bool AddConnection(string userId, string connectionId)
    {
        lock (_lock)
        {
            var connections = _userConnections.GetOrAdd(userId, _ => new ConcurrentDictionary<string, byte>());
            var wasEmpty = connections.IsEmpty;
            connections.TryAdd(connectionId, 0);
            return wasEmpty;
        }
    }

    public bool RemoveConnection(string userId, string connectionId)
    {
        lock (_lock)
        {
            if (!_userConnections.TryGetValue(userId, out var connections))
                return false;

            connections.TryRemove(connectionId, out _);

            if (connections.IsEmpty)
            {
                _userConnections.TryRemove(userId, out _);
                return true;
            }

            return false;
        }
    }

    public bool IsUserOnline(string userId)
    {
        return _userConnections.TryGetValue(userId, out var connections) && !connections.IsEmpty;
    }

    public IReadOnlyList<string> GetUserConnections(string userId)
    {
        if (_userConnections.TryGetValue(userId, out var connections))
        {
            return connections.Keys.ToList();
        }
        return Array.Empty<string>();
    }

    public IReadOnlyList<string> GetOnlineUserIds()
    {
        return _userConnections
            .Where(kvp => !kvp.Value.IsEmpty)
            .Select(kvp => kvp.Key)
            .ToList();
    }

    public int GetOnlineUserCount()
    {
        return _userConnections.Count(kvp => !kvp.Value.IsEmpty);
    }
}

