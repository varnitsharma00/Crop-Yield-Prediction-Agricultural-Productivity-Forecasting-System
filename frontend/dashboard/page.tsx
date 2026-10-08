"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---- Types, matching GET /api/v1/predictions/history ----

interface PredictionHistoryItem {
  id: number;
  crop_type: string;
  region: string;
  predicted_yield_kg_ha: number;
  soil_suitability_score: number;
  model_version: string;
  created_at: string; // ISO timestamp
}

interface PredictionHistoryResponse {
  predictions: PredictionHistoryItem[];
}

// Derived shape used by the trend chart (adds a formatted date label)
interface TrendPoint {
  date: string;
  yield_kg_ha: number;
  crop_type: string;
}

// Derived shape used by the crop comparison chart
interface CropAverage {
  crop_type: string;
  avg_yield_kg_ha: number;
  sample_count: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export default function DashboardPage() {
  const [predictions, setPredictions] = useState<PredictionHistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHistory() {
      setLoading(true);
      setError(null);

      // NOTE: adjust this if your app stores the token differently
      // (e.g. a context/provider, a cookie, or a different localStorage key).
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("You need to be signed in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/v1/predictions/history`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : `Request failed with status ${res.status}`
          );
        }

        const data: PredictionHistoryResponse = await res.json();
        setPredictions(data.predictions);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong loading your dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
    return () => controller.abort();
  }, []);

  // Yield trend over time, sorted chronologically
  const trendData: TrendPoint[] = useMemo(() => {
    if (!predictions) return [];
    return [...predictions]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((p) => ({
        date: new Date(p.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        yield_kg_ha: p.predicted_yield_kg_ha,
        crop_type: p.crop_type,
      }));
  }, [predictions]);

  // Average yield grouped by crop type
  const cropAverages: CropAverage[] = useMemo(() => {
    if (!predictions) return [];
    const groups = new Map<string, number[]>();
    for (const p of predictions) {
      const list = groups.get(p.crop_type) ?? [];
      list.push(p.predicted_yield_kg_ha);
      groups.set(p.crop_type, list);
    }
    return Array.from(groups.entries()).map(([crop_type, yields]) => ({
      crop_type,
      avg_yield_kg_ha: Math.round(yields.reduce((a, b) => a + b, 0) / yields.length),
      sample_count: yields.length,
    }));
  }, [predictions]);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Yield Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Your prediction history, trended over time and compared across crops.
          </p>
        </header>

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && predictions && predictions.length === 0 && <EmptyState />}

        {!loading && !error && predictions && predictions.length > 0 && (
          <div className="space-y-8">
            <ChartCard title="Yield trend" subtitle="Predicted yield over time">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#737373" }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#737373" }}
                    label={{ value: "kg/ha", angle: -90, position: "insideLeft", fontSize: 12, fill: "#737373" }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 13 }}
                    formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, "Predicted yield"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="yield_kg_ha"
                    stroke="#3f6212"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3f6212" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Yield by crop" subtitle="Average predicted yield per crop type">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropAverages} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="crop_type" tick={{ fontSize: 12, fill: "#737373" }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#737373" }}
                    label={{ value: "kg/ha", angle: -90, position: "insideLeft", fontSize: 12, fill: "#737373" }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 13 }}
                    formatter={(value: number, _name, item) => [
                      `${value.toLocaleString()} kg/ha (${item.payload.sample_count} prediction${
                        item.payload.sample_count === 1 ? "" : "s"
                      })`,
                      "Avg. yield",
                    ]}
                  />
                  <Bar dataKey="avg_yield_kg_ha" fill="#65a30d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-medium text-neutral-900">{title}</h2>
      <p className="mb-4 text-sm text-neutral-500">{subtitle}</p>
      {children}
    </section>
  );
}

function LoadingState() {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-neutral-200 bg-white">
      <p className="text-sm text-neutral-500">Loading your predictions…</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <p className="text-sm font-medium text-red-800">Couldn't load your dashboard</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white text-center">
      <p className="text-sm font-medium text-neutral-700">No predictions yet</p>
      <p className="mt-1 max-w-xs text-sm text-neutral-500">
        Submit a crop yield prediction to see your trends and comparisons here.
      </p>
    </div>
  );
}
