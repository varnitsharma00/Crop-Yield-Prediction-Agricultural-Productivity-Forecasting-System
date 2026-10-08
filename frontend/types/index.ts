// File: frontend/types/index.ts

export type UserRole = "farmer" | "cooperative" | "agribusiness" | "government" | "admin";

export type OnboardingRole =
  | "Farmer"
  | "Cooperative Member"
  | "Agribusiness"
  | "Government Officer";

export const ROLE_KEY_MAP: Record<OnboardingRole, UserRole> = {
  "Farmer": "farmer",
  "Cooperative Member": "cooperative",
  "Agribusiness": "agribusiness",
  "Government Officer": "government",
};

export type CropOption = "Rice" | "Cotton" | "Wheat" | "Maize";
export type BusinessType = "Input Supplier" | "Crop Buyer" | "Processor" | "Other";
export type JurisdictionLevel = "District" | "State" | "National";

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  expires_in_minutes: number;
}

export interface OnboardingRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  state: string;
  district: string;
  crops?: CropOption[];
  organization_name?: string;
  business_type?: BusinessType;
  jurisdiction_level?: JurisdictionLevel;
}

export interface OnboardingResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  farm_id: string;
  expires_in_minutes: number;
}

export interface OnboardingData {
  role: OnboardingRole;
  state: string;
  district: string;
  crops: CropOption[];
  organizationName: string;
  businessType: BusinessType | "";
  jurisdictionLevel: JurisdictionLevel | "";
  fullName: string;
  email: string;
  password: string;
}

export interface YieldPrediction {
  crop: CropOption;
  predicted_yield_kg_per_ha: number;
  confidence_score: number;
  model_version: string;
}