import { Document } from "mongoose";

export interface User extends Document {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: "OK" | "ERROR";
  service: string;
  timestamp: string;
  uptime?: number;
}

// Environment variables interface
export interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  JWT_COOKIE_EXPIRES_IN?: string;
}
