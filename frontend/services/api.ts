// Typed API client wrapping fetch calls to the FastAPI backend.
// File: frontend/services/api.ts

import type {
  LoginRequest,
  OnboardingRequest,
  OnboardingResponse,
  RegisterRequest,
  TokenResponse,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> 
{
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) 
{
  const errorBody = await response.json().catch(() => ({}));
  const error = new Error(errorBody.detail ?? `Request failed with status ${response.status}`) as Error & { status?: number };
  error.status = response.status;
  throw error;
}

  return response.json() as Promise<T>;
}

export const authService = {
  register: (payload: RegisterRequest) =>
    request<{ user_id: string; full_name: string; email: string; role: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  login: (payload: LoginRequest) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    request<{ user_id: string; role: string }>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export const onboardingService = {
  submit: (payload: OnboardingRequest) =>
    request<OnboardingResponse>("/onboarding/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};