export type RiskSeverity = "Low" | "Medium" | "High";

export interface RiskItem {
  type: string;
  severity: RiskSeverity;
  advice: string;
}

export interface AnalyticsRequest {
  crop_type: "Wheat" | "Rice" | "Maize";
  avg_temp: number;
  rainfall: number;
  soil_ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface AnalyticsResponse {
  crop: string;
  overall_risk_level: RiskSeverity;
  risk_score: number;
  identified_risks: RiskItem[];
  actionable_recommendations: string[];
  best_practice_tips: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getFarmInsights(payload: AnalyticsRequest): Promise<AnalyticsResponse> {
  const token = localStorage.getItem("ys_access_token");

  const res = await fetch(`${API_BASE}/api/v1/analytics/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Farm insights request failed (${res.status})`);
  }

  return res.json();
}
