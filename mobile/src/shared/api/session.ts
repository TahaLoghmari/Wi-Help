import { AUTH_PROTOCOL_ENDPOINTS } from "@/shared/api/auth-endpoints";
import { env } from "@/shared/config/env";
import { tokenStorage } from "@/shared/api/token-storage";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionStorage {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(accessToken: string, refreshToken: string): Promise<void>;
  clearTokens(): Promise<void>;
}

export interface Session {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(tokens: SessionTokens): Promise<void>;
  clear(): Promise<void>;
  refresh(): Promise<boolean>;
}

interface CreateSessionOptions {
  storage?: SessionStorage;
  fetchImpl?: typeof fetch;
  apiUrl?: string;
}

export function createSession({
  storage = tokenStorage,
  fetchImpl = fetch,
  apiUrl = env.apiUrl,
}: CreateSessionOptions = {}): Session {
  let generation = 0;
  let refreshPromise: Promise<boolean> | null = null;
  let storageQueue = Promise.resolve();

  function enqueueStorage(operation: () => Promise<void>) {
    storageQueue = storageQueue.then(operation, operation);
    return storageQueue;
  }

  return {
    getAccessToken: () => storage.getAccessToken(),
    getRefreshToken: () => storage.getRefreshToken(),

    setTokens(tokens) {
      generation++;
      return enqueueStorage(() =>
        storage.setTokens(tokens.accessToken, tokens.refreshToken),
      );
    },

    clear() {
      generation++;
      return enqueueStorage(() => storage.clearTokens());
    },

    refresh() {
      if (refreshPromise) return refreshPromise;

      const refreshGeneration = generation;
      refreshPromise = (async () => {
        const refreshToken = await storage.getRefreshToken();
        if (generation !== refreshGeneration) return false;

        if (!refreshToken) {
          generation++;
          await enqueueStorage(() => storage.clearTokens());
          return false;
        }

        try {
          const response = await fetchImpl(
            `${apiUrl}${AUTH_PROTOCOL_ENDPOINTS.REFRESH}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            },
          );

          if (generation !== refreshGeneration) return false;

          if (!response.ok) {
            generation++;
            await enqueueStorage(() => storage.clearTokens());
            return false;
          }

          const tokens = (await response.json()) as SessionTokens;
          if (generation !== refreshGeneration) return false;

          generation++;
          await enqueueStorage(() =>
            storage.setTokens(tokens.accessToken, tokens.refreshToken),
          );
          return true;
        } catch {
          if (generation === refreshGeneration) {
            generation++;
            await enqueueStorage(() => storage.clearTokens());
          }
          return false;
        }
      })().finally(() => {
        refreshPromise = null;
      });

      return refreshPromise;
    },
  };
}

export const session = createSession();
