/**
 * Environment variables configuration
 */

export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  // App Configuration
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Validate required environment variables
if (!env.API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set. Using default: http://localhost:3001');
}

