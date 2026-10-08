export interface PredictionRequest {
  crop_type: string;
  region: string;
  soil_ph: number;
  nitrogen_kg_ha: number;
  phosphorus_kg_ha: number;
  potassium_kg_ha: number;
}

export interface PredictionResponse {
  predicted_yield_kg_ha: number;
  soil_suitability_score: number;
  model_version: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getPrediction(payload: PredictionRequest): Promise<PredictionResponse> {
  const token = localStorage.getItem("ys_access_token");

  const res = await fetch(`${API_BASE}/api/v1/predictions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Prediction failed (${res.status})`);
  }

  return res.json();
}
