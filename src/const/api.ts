/// <reference types="vite/client" />

export const API = {
  URL: import.meta.env.VITE_API_BROWSER_URL,
  USER: import.meta.env.VITE_API_USER,
  PASSWORD: import.meta.env.VITE_API_PASSWORD,
} as { URL: string; USER: string; PASSWORD: string };
