// music-player-user-dummy/src/config/env.ts

interface EnvConfig {
  VITE_API_BASE_URL: string;
  // Add other environment variables here as needed
}

const getEnv = (): EnvConfig => {
  const env: EnvConfig = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    // Map other environment variables here
  };

  // Runtime validation
  for (const key in env) {
    if (env[key as keyof EnvConfig] === undefined || env[key as keyof EnvConfig] === null || env[key as keyof EnvConfig] === '') {
      throw new Error(`Missing environment variable: ${key}. Please check your .env file.`);
    }
  }

  return env;
};

export const env = getEnv();
