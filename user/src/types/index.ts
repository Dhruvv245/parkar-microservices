import { Document } from "mongoose";

export interface User extends Document {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

export interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
  JWT_COOKIE_EXPIRES_IN?: string;
}
