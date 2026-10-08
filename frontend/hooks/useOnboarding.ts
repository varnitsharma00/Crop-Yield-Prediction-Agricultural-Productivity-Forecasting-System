// File: frontend/hooks/useOnboarding.ts
"use client";

import { useState } from "react";
import { onboardingService } from "../services/api";
import { ROLE_KEY_MAP } from "../types";
import type {
  BusinessType, CropOption, JurisdictionLevel, OnboardingData,
  OnboardingResponse, OnboardingRole,
} from "../types";

const initialState: OnboardingData = {
  role: "Farmer", state: "", district: "", crops: [],
  organizationName: "", businessType: "", jurisdictionLevel: "",
  fullName: "", email: "", password: "",
};

export function useOnboarding() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<OnboardingData>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);

  const setRole = (role: OnboardingRole) => setData((prev) => ({ ...prev, role }));
  const setLocation = (state: string, district: string) => setData((prev) => ({ ...prev, state, district }));
  const toggleCrop = (crop: CropOption) =>
    setData((prev) => ({
      ...prev,
      crops: prev.crops.includes(crop) ? prev.crops.filter((c) => c !== crop) : [...prev.crops, crop],
    }));
  const setAccountField = (field: "fullName" | "email" | "password", value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));
  const setOrganizationName = (value: string) => setData((prev) => ({ ...prev, organizationName: value }));
  const setBusinessType = (value: BusinessType) => setData((prev) => ({ ...prev, businessType: value }));
  const setJurisdictionLevel = (value: JurisdictionLevel) => setData((prev) => ({ ...prev, jurisdictionLevel: value }));

  const nextStep = () => setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));

  const isAccountValid = () =>
    data.fullName.length >= 2 && data.email.includes("@") && data.password.length >= 8;

  const isStepValid = (): boolean => {
    if (step === 1) return Boolean(data.role);
    if (step === 2) return data.state.length > 0 && data.district.length > 0;
    if (step === 3) {
      if (data.role === "Farmer") return data.crops.length > 0 && isAccountValid();
      if (data.role === "Cooperative Member")
        return data.crops.length > 0 && data.organizationName.trim().length > 1 && isAccountValid();
      if (data.role === "Agribusiness")
        return data.organizationName.trim().length > 1 && Boolean(data.businessType) && isAccountValid();
      if (data.role === "Government Officer")
        return data.organizationName.trim().length > 1 && Boolean(data.jurisdictionLevel) && isAccountValid();
      return false;
    }
    return false;
  };

  const submit = async (): Promise<OnboardingResponse> => {
    setSubmitting(true);
    setSubmitError(null);
    setIsDuplicateEmail(false);
    try {
      return await onboardingService.submit({
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        role: ROLE_KEY_MAP[data.role],
        state: data.state,
        district: data.district,
        crops: data.crops.length > 0 ? data.crops : undefined,
        organization_name: data.organizationName || undefined,
        business_type: data.businessType || undefined,
        jurisdiction_level: data.jurisdictionLevel || undefined,
      });
    } catch (err) {
      const status = (err as { status?: number })?.status;
      setIsDuplicateEmail(status === 409);
      setSubmitError(err instanceof Error ? err.message : "Onboarding failed.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step, data, setRole, setLocation, toggleCrop, setAccountField,
    setOrganizationName, setBusinessType, setJurisdictionLevel,
    nextStep, prevStep, isStepValid, submit, submitting, submitError, isDuplicateEmail,
  };
}