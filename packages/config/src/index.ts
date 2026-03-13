export const appConfig = {
  appName: "MMJ Jewellery Retail",
  apiUrl: process.env.API_URL ?? "http://localhost:4000",
} as const;

export type AppConfig = typeof appConfig;