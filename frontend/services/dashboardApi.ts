export interface YieldTrendPoint {
  season: string;
  yield: number;
}

export interface CropComparisonPoint {
  name: string;
  yield: number;
}

export interface DashboardSummary {
  yield_trend: YieldTrendPoint[];
  productivity_score: number;
  crop_comparison: CropComparisonPoint[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const token = localStorage.getItem("ys_access_token");

  const res = await fetch(`${API_BASE}/api/v1/dashboard/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Dashboard summary request failed (${res.status})`);
  }

  return res.json();
}
