export const logger = {
  info: (...args: unknown[]) => console.info("[Wi-Help]", ...args),
  warn: (...args: unknown[]) => console.warn("[Wi-Help]", ...args),
  error: (...args: unknown[]) => console.error("[Wi-Help]", ...args),
};
