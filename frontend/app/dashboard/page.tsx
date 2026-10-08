"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Sprout,
  CloudSun,
  Layers,
  LineChart as LineChartIcon,
  FileText,
  Bell,
  ArrowRight,
  Download,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { getDashboardSummary, DashboardSummary } from "../../services/dashboardApi";
import { downloadPredictionsCsv } from "../../services/reportsApi";

// Quick-action tiles shown at the top of the dashboard.
// Only "Predict Yield" has a dedicated route today — the rest route to
// /predict as well until their own pages exist (see README/roadmap).
const QUICK_ACTIONS = [
  { label: "Predict Yield", icon: Sprout, href: "/predict" },
  { label: "Weather", icon: CloudSun, href: "/predict" },
  { label: "Soil Health", icon: Layers, href: "/predict" },
  { label: "Market Prices", icon: LineChartIcon, href: "/predict" },
  { label: "Reports", icon: FileText, href: "/predict" },
  { label: "Alerts", icon: Bell, href: "/predict" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadPredictionsCsv();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Farm Dashboard</h1>
        <p className="subtitle">Your yield predictions and performance at a glance.</p>

        {/* Quick-action grid */}
        <div className="quickGrid">
          {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
            <a key={label} href={href} className="quickTile">
              <span className="quickIcon">
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="quickLabel">{label}</span>
            </a>
          ))}
        </div>

        {/* Featured promo card */}
        <a href="/predict" className="promoCard">
          <div className="promoArt" aria-hidden="true">
            <Sprout size={48} strokeWidth={1.5} />
          </div>
          <div className="promoBody">
            <p className="promoTitle">Get started with a new prediction</p>
            <p className="promoText">
              Enter your field, crop, and season details to generate a fresh yield forecast in seconds.
            </p>
            <span className="promoBtn">
              Start Prediction <ArrowRight size={16} />
            </span>
          </div>
        </a>

        {loading && (
          <div className="card skeleton">
            <div className="skel-line skel-label" />
            <div className="skel-line skel-chart" />
          </div>
        )}

        {!loading && error && (
          <div className="card">
            <p className="error">{error}</p>
          </div>
        )}

        {!loading && !error && data && data.yield_trend.length === 0 && (
          <div className="card">
            <p className="empty">
              Not enough data yet. Make a prediction on the{" "}
              <a href="/predict" className="link">Predict Yield</a> page to see it show up here.
            </p>
          </div>
        )}

        {!loading && !error && data && data.yield_trend.length > 0 && (
          <>
            <div className="card score-card">
              <p className="label">Productivity Score</p>
              <p className="score">{data.productivity_score}%</p>
              <p className="sub">
                Latest prediction compared to your average across all past predictions.
              </p>
            </div>

            <div className="card">
              <p className="label">Yield Trend</p>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data.yield_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="season" stroke="#6b7280" fontSize={13} />
                  <YAxis stroke="#6b7280" fontSize={13} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #d1d5db", fontSize: 13 }}
                    formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, "Yield"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="yield"
                    stroke="#15803d"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#15803d" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {data.crop_comparison.length > 1 && (
              <div className="card">
                <p className="label">Crop Comparison</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.crop_comparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={13} />
                    <YAxis stroke="#6b7280" fontSize={13} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid #d1d5db", fontSize: 13 }}
                      formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, "Avg Yield"]}
                    />
                    <Bar dataKey="yield" fill="#15803d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {data.crop_comparison.length === 1 && (
              <div className="card">
                <p className="label">Crop Comparison</p>
                <p className="empty">
                  Predict yield for a second crop type to unlock the comparison chart.
                </p>
              </div>
            )}
          </>
        )}

        {/* Bottom CTA pills */}
        <div className="ctaRow">
          <a href="/predict" className="pillBtn pillBtnPrimary">
            <Sprout size={18} /> New Prediction
          </a>
          <button
            className="pillBtn pillBtnOutline"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={18} />
            {downloading ? "Preparing download..." : "Download Report (CSV)"}
          </button>
        </div>

        <style jsx>{`
          .page { max-width: 800px; margin: 0 auto; padding: 40px 24px 100px; }
          h1 { font-size: 28px; font-weight: 800; color: #14532d; margin-bottom: 4px; }
          .subtitle { color: #6b7280; margin-bottom: 24px; }

          /* Quick-action grid */
          .quickGrid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .quickTile {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: var(--color-surface);
            border: 1px solid var(--color-neutral-200);
            border-radius: var(--radius-md);
            padding: 18px 8px;
            text-decoration: none;
            box-shadow: var(--shadow-sm);
            transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
          }
          .quickTile:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: var(--color-primary-500);
          }
          .quickIcon {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-primary-100);
            color: var(--color-primary-700);
          }
          .quickLabel {
            font-size: 12.5px;
            font-weight: 600;
            color: var(--color-neutral-900);
            text-align: center;
            line-height: 1.3;
          }

          /* Featured promo card */
          .promoCard {
            display: flex;
            align-items: center;
            gap: 20px;
            background: var(--gradient-primary);
            border-radius: var(--radius-lg);
            padding: 24px;
            margin-bottom: 20px;
            text-decoration: none;
            box-shadow: var(--shadow-lg);
          }
          .promoArt {
            flex-shrink: 0;
            width: 84px;
            height: 84px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.16);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
          }
          .promoBody { flex: 1; min-width: 0; }
          .promoTitle {
            color: #fff;
            font-size: 17px;
            font-weight: 700;
            margin: 0 0 6px;
          }
          .promoText {
            color: rgba(255, 255, 255, 0.85);
            font-size: 13.5px;
            line-height: 1.5;
            margin: 0 0 14px;
          }
          .promoBtn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fff;
            color: var(--color-primary-700);
            font-size: 13.5px;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 999px;
          }

          .card {
            background: white;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 20px;
          }
          .label { font-size: 14px; color: #4b5563; font-weight: 600; margin: 0 0 8px; }
          .score-card { background: #f0fdf4; }
          .score { font-size: 40px; font-weight: 800; color: #15803d; margin: 4px 0; }
          .sub { font-size: 13px; color: #6b7280; margin: 4px 0 0; }
          .error { color: #dc2626; font-size: 14px; }
          .empty { color: #6b7280; font-size: 14px; line-height: 1.6; }
          .link { color: #15803d; font-weight: 600; text-decoration: none; }
          .link:hover { text-decoration: underline; }

          .skeleton { display: flex; flex-direction: column; gap: 14px; }
          .skel-line {
            border-radius: 6px;
            background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s ease-in-out infinite;
          }
          .skel-label { width: 30%; height: 14px; }
          .skel-chart { width: 100%; height: 260px; }

          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }

          /* Bottom CTA pills */
          .ctaRow {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 8px;
          }
          .pillBtn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 14px 20px;
            border-radius: 999px;
            font-size: 14.5px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            border: none;
          }
          .pillBtnPrimary {
            background: var(--color-primary-500);
            color: #fff;
          }
          .pillBtnPrimary:hover { background: var(--color-primary-700); }
          .pillBtnOutline {
            background: #fff;
            color: var(--color-primary-700);
            border: 1.5px solid var(--color-primary-500);
          }
          .pillBtnOutline:hover { background: var(--color-primary-100); }
          .pillBtnOutline:disabled { opacity: 0.6; cursor: not-allowed; }

          @media (min-width: 480px) {
            .quickGrid { grid-template-columns: repeat(6, 1fr); }
            .ctaRow { flex-direction: row; }
          }
        `}</style>
      </div>
    </>
  );
}
