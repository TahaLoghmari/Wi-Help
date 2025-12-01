using System.Collections.Concurrent;

namespace Modules.Messaging.Infrastructure.Services;

/// <summary>
/// Tracks online users and their SignalR connection IDs.
/// Thread-safe implementation using ConcurrentDictionary.
/// </summary>
public class ConnectionTracker
{
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _userConnections = new();

    public void AddConnection(string userId, string connectionId)
    {
        var connections = _userConnections.GetOrAdd(userId, _ => new ConcurrentDictionary<string, byte>());
        connections.TryAdd(connectionId, 0);
    }

    public void RemoveConnection(string userId, string connectionId)
    {
        if (_userConnections.TryGetValue(userId, out var connections))
        {
            connections.TryRemove(connectionId, out _);
            
            // Clean up empty user entries
            if (connections.IsEmpty)
            {
                _userConnections.TryRemove(userId, out _);
            }
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

