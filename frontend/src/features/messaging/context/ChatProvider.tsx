import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { env } from "@/config/env";
import { useCurrentUser } from "@/features/auth";

interface ChatContextValue {
  connection: HubConnection | null;
  connectionState: HubConnectionState;
  connectionError: Error | null;
  onlineUserIds: Set<string>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const connectionRef = useRef<HubConnection | null>(null);
  const [activeConnection, setActiveConnection] =
    useState<HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.Disconnected,
  );
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(
    () => new Set(),
  );

  // Track if we're intentionally stopping to avoid error messages
  const isStoppingRef = useRef(false);

  useEffect(() => {
    // Wait for user loading to complete before deciding
    if (isUserLoading) {
      return;
    }

    // No authenticated user -> make sure connection is stopped
    if (!currentUser) {
      if (connectionRef.current) {
        isStoppingRef.current = true;
        const existingConnection = connectionRef.current;
        existingConnection
          .stop()
          .catch((err) =>
            console.error("Error stopping chat connection on logout:", err),
          )
          .finally(() => {
            if (connectionRef.current === existingConnection) {
              connectionRef.current = null;
            }
            setActiveConnection(null);
            isStoppingRef.current = false;
          });
      }

      setActiveConnection(null);
      setConnectionState(HubConnectionState.Disconnected);
      setConnectionError(null);
      setOnlineUserIds(new Set());
      return;
    }

    // Avoid starting a second connection for the same logged-in user
    if (
      connectionRef.current &&
      connectionRef.current.state !== HubConnectionState.Disconnected
    ) {
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${env.apiUrl}/hubs/chat`, {
        withCredentials: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Don't retry if we're intentionally stopping
          if (isStoppingRef.current) return null;

          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          if (retryContext.previousRetryCount < 10) return 30000;
          // Stop retrying after 10 attempts
          return null;
        },
      })
      .configureLogging(
        env.isDevelopment ? LogLevel.Information : LogLevel.Warning,
      )
      .build();

    // Configure server timeout (should be > 2x server's KeepAliveInterval)
    // Server default KeepAliveInterval is 15s, so we set this to 60s
    connection.serverTimeoutInMilliseconds = 60000;
    // How often client sends ping to server
    connection.keepAliveIntervalInMilliseconds = 15000;

    connectionRef.current = connection;
    setActiveConnection(connection);
    setConnectionState(HubConnectionState.Connecting);
    setConnectionError(null);

    connection.onreconnecting((error) => {
      console.warn("ChatHub reconnecting...", error);
      setConnectionState(HubConnectionState.Reconnecting);
      if (error) {
        setConnectionError(error);
      }
      // Don't clear online users here - we'll get fresh data on reconnect
    });

    connection.onreconnected((connectionId) => {
      console.log("ChatHub reconnected. ConnectionId:", connectionId);
      setConnectionState(HubConnectionState.Connected);
      setConnectionError(null);
      toast.success("Reconnected to chat");
      // Request fresh online users list after reconnection
      connection.invoke("GetOnlineUsers").catch((err) => {
        console.error("Failed to get online users after reconnect:", err);
      });
    });

    connection.onclose((error) => {
      // Don't log as error if we're intentionally stopping
      if (isStoppingRef.current) {
        console.log("ChatHub connection closed (intentional)");
      } else if (error) {
        console.error("ChatHub connection closed with error:", error);
        setConnectionError(error);
        toast.error("Chat connection lost. Attempting to reconnect...");
      } else {
        console.log("ChatHub connection closed");
      }
      setConnectionState(HubConnectionState.Disconnected);
      setOnlineUserIds(new Set());
    });

    connection.on("UserOnline", (userId: string) => {
      setOnlineUserIds((prev) => {
        if (prev.has(userId)) {
          return prev;
        }
        const updated = new Set(prev);
        updated.add(userId);
        return updated;
      });
    });

    connection.on("UserOffline", (userId: string) => {
      setOnlineUserIds((prev) => {
        if (!prev.has(userId)) {
          return prev;
        }
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    // Handle bulk online users list (sent on connect and can be requested)
    connection.on("OnlineUsers", (userIds: string[]) => {
      console.log("Received online users list:", userIds);
      setOnlineUserIds(new Set(userIds));
    });

    connection
      .start()
      .then(() => {
        console.log(
          "ChatHub connected successfully. ConnectionId:",
          connection.connectionId,
        );
        setConnectionState(HubConnectionState.Connected);
        setConnectionError(null);
      })
      .catch((err) => {
        console.error("ChatHub connection failed:", err);
        setConnectionState(HubConnectionState.Disconnected);
        setConnectionError(err as Error);
        // Only show toast if it's not a silent failure during HMR
        if (!isStoppingRef.current) {
          toast.error("Failed to connect to chat. Please refresh the page.");
        }
        connectionRef.current = null;
      });

    return () => {
      isStoppingRef.current = true;
      connection
        .stop()
        .catch((err) => console.error("Error stopping ChatHub:", err))
        .finally(() => {
          if (connectionRef.current === connection) {
            connectionRef.current = null;
          }
          setActiveConnection((current) =>
            current === connection ? null : current,
          );
          setConnectionState(HubConnectionState.Disconnected);
          setOnlineUserIds(new Set());
          isStoppingRef.current = false;
        });
    };
  }, [currentUser?.id, isUserLoading]);

  const contextValue = useMemo<ChatContextValue>(
    () => ({
      connection: activeConnection,
      connectionState,
      connectionError,
      onlineUserIds,
    }),
    [activeConnection, connectionState, connectionError, onlineUserIds],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Default context value for when provider is not available (e.g., during HMR)
const defaultContextValue: ChatContextValue = {
  connection: null,
  connectionState: HubConnectionState.Disconnected,
  connectionError: null,
  onlineUserIds: new Set(),
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  // Return default value instead of throwing during HMR or error recovery
  // This prevents cascading errors when the component tree is being rebuilt
  if (!ctx) {
    console.warn(
      "useChatContext called outside of ChatProvider. This can happen during HMR. Returning default context.",
    );
    return defaultContextValue;
  }
  return ctx;
};
