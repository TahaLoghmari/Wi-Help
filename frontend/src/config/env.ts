const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  apiUrl: getEnvVar("VITE_API_URL", "http://localhost:5000"),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
