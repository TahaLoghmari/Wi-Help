import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { AppState, type AppStateStatus } from "react-native";
import { env } from "@/config/env";
import { session as sharedSession, type Session } from "@/lib/session";
import type { RealtimeLifecycleError } from "./realtime-types";

type ConnectionStateListener = (state: HubConnectionState) => void;
type ErrorListener = (error: RealtimeLifecycleError) => void;
type EventHandler = (...args: unknown[]) => void;

interface HubConfig {
  hubPath: string;
  onReconnected?: () => void;
  session?: Session;
}

export class SignalRService {
  private connection: HubConnection | null = null;
  private isStopping = false;
  private stateListeners = new Set<ConnectionStateListener>();
  private errorListeners = new Set<ErrorListener>();
  private eventHandlers = new Map<string, Set<EventHandler>>();
  private appStateSubscription: ReturnType<
    typeof AppState.addEventListener
  > | null = null;
  private readonly hubPath: string;
  private readonly onReconnected?: () => void;
  private readonly session: Session;
  private lifecycleGeneration = 0;

  constructor(config: HubConfig) {
    this.hubPath = config.hubPath;
    this.onReconnected = config.onReconnected;
    this.session = config.session ?? sharedSession;
  }

  get state(): HubConnectionState {
    return this.connection?.state ?? HubConnectionState.Disconnected;
  }

  get isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  async start(): Promise<void> {
    if (
      this.connection &&
      (this.connection.state === HubConnectionState.Connected ||
        this.connection.state === HubConnectionState.Connecting ||
        this.connection.state === HubConnectionState.Reconnecting)
    ) {
      return;
    }

    if (this.connection) {
      this.removeAllNativeListeners();
      this.connection = null;
    }
    const lifecycleGeneration = ++this.lifecycleGeneration;

    const connection = new HubConnectionBuilder()
      .withUrl(`${env.apiUrl}${this.hubPath}`, {
        accessTokenFactory: async () => {
          const token = await this.session.getAccessToken();
          return token ?? "";
        },
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (this.isStopping) return null;
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          if (retryContext.previousRetryCount < 10) return 30000;
          return null;
        },
      })
      .configureLogging(
        env.isDevelopment ? LogLevel.Information : LogLevel.Warning,
      )
      .build();

    connection.serverTimeoutInMilliseconds = 60000;
    connection.keepAliveIntervalInMilliseconds = 15000;

    connection.onreconnecting(() => {
      this.notifyStateListeners(HubConnectionState.Reconnecting);
    });

    connection.onreconnected(() => {
      this.notifyStateListeners(HubConnectionState.Connected);
      this.onReconnected?.();
    });

    connection.onclose((error) => {
      this.notifyStateListeners(HubConnectionState.Disconnected);
      if (!this.isStopping && error) {
        console.error(`[SignalR:${this.hubPath}] closed with error:`, error);
      }
    });

    for (const [event, handlers] of this.eventHandlers) {
      for (const handler of handlers) {
        connection.on(event, handler as (...args: unknown[]) => void);
      }
    }

    this.connection = connection;
    this.notifyStateListeners(HubConnectionState.Connecting);

    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange,
    );

    try {
      await connection.start();
      if (
        lifecycleGeneration !== this.lifecycleGeneration ||
        this.connection !== connection
      ) {
        return;
      }
      this.notifyStateListeners(HubConnectionState.Connected);
    } catch (err: unknown) {
      let failure = err;
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("401") || message.includes("Unauthorized")) {
        const refreshed = await this.session.refresh();
        if (
          refreshed &&
          lifecycleGeneration === this.lifecycleGeneration &&
          this.connection === connection
        ) {
          try {
            await connection.start();
            if (
              lifecycleGeneration !== this.lifecycleGeneration ||
              this.connection !== connection
            ) {
              return;
            }
            this.notifyStateListeners(HubConnectionState.Connected);
            return;
          } catch (retryErr) {
            failure = retryErr;
            console.error(
              `[SignalR:${this.hubPath}] failed after token refresh:`,
              retryErr,
            );
          }
        }
      }
      this.notifyStateListeners(HubConnectionState.Disconnected);
      this.notifyErrorListeners({ operation: "start", cause: failure });
      console.error(`[SignalR:${this.hubPath}] connection failed:`, failure);
      throw failure;
    }
  }

  async stop(): Promise<void> {
    this.lifecycleGeneration++;
    this.isStopping = true;
    this.removeAllNativeListeners();

    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error(`[SignalR:${this.hubPath}] stop error:`, err);
      }
      this.connection = null;
    }
    this.notifyStateListeners(HubConnectionState.Disconnected);
    this.isStopping = false;
  }

  async invoke(method: string, ...args: unknown[]): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      try {
        await this.connection.invoke(method, ...args);
      } catch (err) {
        this.notifyErrorListeners({ operation: "invoke", method, cause: err });
        console.error(
          `[SignalR:${this.hubPath}] invoke ${method} failed:`,
          err,
        );
        throw err;
      }
    }
  }

  on(event: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    this.connection?.on(event, handler as (...args: unknown[]) => void);

    return () => {
      this.eventHandlers.get(event)?.delete(handler);
      this.connection?.off(event, handler as (...args: unknown[]) => void);
    };
  }

  onStateChange(listener: ConnectionStateListener): () => void {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }

  private notifyStateListeners(state: HubConnectionState) {
    for (const listener of this.stateListeners) {
      listener(state);
    }
  }

  private notifyErrorListeners(error: RealtimeLifecycleError) {
    for (const listener of this.errorListeners) {
      listener(error);
    }
  }

  private removeAllNativeListeners() {
    this.appStateSubscription?.remove();
    this.appStateSubscription = null;
  }

  private handleAppStateChange = (nextState: AppStateStatus) => {
    if (nextState === "active") {
      if (
        this.connection &&
        this.connection.state === HubConnectionState.Disconnected &&
        !this.isStopping
      ) {
        this.start().catch((err) =>
          console.error(
            `[SignalR:${this.hubPath}] reconnect on foreground failed:`,
            err,
          ),
        );
      }
    }
  };

}
