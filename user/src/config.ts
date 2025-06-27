import { EnvConfig } from "./types";

export const config: EnvConfig = {
  PORT: parseInt(process.env.PORT || "3001", 10),
  NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;
