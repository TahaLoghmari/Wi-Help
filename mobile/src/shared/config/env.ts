const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  apiUrl:
    getEnvVar("EXPO_PUBLIC_API_URL", "http://192.168.1.18:5000") ||
    "http://192.168.1.18:5000",
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
} as const;
