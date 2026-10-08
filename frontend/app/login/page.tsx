// Login page — split-screen brand panel + card, styled-jsx (no external CSS module needed).
// File: frontend/app/login/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { access_token, role } = await authService.login({ email, password });
      localStorage.setItem("ys_access_token", access_token);
      localStorage.setItem("ys_role", role);
      router.push("/predict");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="brandPanel">
        <span className="brandGlyph g1" aria-hidden="true">🌾</span>
        <span className="brandGlyph g2" aria-hidden="true">🌱</span>

        <div className="brandLogo">🌾 YieldSense AI</div>
        <p className="brandTagline">
          Smart farming decisions start with knowing what&apos;s coming — welcome back.
        </p>

        <div className="featureList">
          <div className="featureItem"><span className="featureIcon">📈</span> Data-driven yield forecasts</div>
          <div className="featureItem"><span className="featureIcon">💧</span> Weather-aware recommendations</div>
          <div className="featureItem"><span className="featureIcon">🌱</span> Soil &amp; season insights</div>
        </div>
      </section>

      <section className="formPanel">
        <form className="card" onSubmit={handleSubmit} noValidate>
          <h1 className="cardHeading">Welcome back</h1>
          <p className="cardSubheading">Log in to see your farm&apos;s latest predictions.</p>

          {error && <div className="errorBanner" role="alert">{error}</div>}

          <div className="field">
            <label className="fieldLabel" htmlFor="email">Email</label>
            <div className="inputWrap">
              <span className="inputIcon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="password">Password</label>
            <div className="inputWrap">
              <span className="inputIcon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <input
                id="password"
                className="input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggleVisibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.5 5.4A9.7 9.7 0 0 1 12 5c5 0 9 4 9 7a9.6 9.6 0 0 1-3.2 3.6M6.2 6.6C4 8.2 3 10 3 12c0 3 4 7 9 7 1 0 1.9-.15 2.8-.4" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="submitButton" disabled={loading}>
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="footerText">
            New here? <a className="footerLink" href="/onboarding">Start onboarding →</a>
          </p>
        </form>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--color-background, #f7f9f6);
        }

        @media (max-width: 860px) {
          .page { grid-template-columns: 1fr; }
          .brandPanel { min-height: 220px; }
        }

        .brandPanel {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
        }

        .brandGlyph { position: absolute; font-size: 8rem; opacity: 0.12; line-height: 1; user-select: none; }
        .g1 { top: -2rem; left: -2rem; transform: rotate(-15deg); }
        .g2 { bottom: -3rem; right: -1rem; transform: rotate(20deg); }
        .brandLogo { font-size: 2.25rem; font-weight: 700; margin-bottom: 0.75rem; }
        .brandTagline { font-size: 1.15rem; font-weight: 500; max-width: 380px; line-height: 1.5; margin-bottom: 2rem; opacity: 0.95; }
        .featureList { display: flex; flex-direction: column; gap: 1rem; }
        .featureItem { display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; }
        .featureIcon { font-size: 1.4rem; }
        .formPanel { display: flex; align-items: center; justify-content: center; padding: 2rem; }

        .card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 12px 32px rgba(27, 94, 32, 0.18);
          padding: 3rem 2rem;
          animation: fadeInUp 0.5s ease both;
        }

        .cardHeading { font-size: 1.75rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.5rem; }
        .cardSubheading { color: #5f6368; margin: 0 0 2rem; font-size: 0.95rem; }
        .field { margin-bottom: 1.5rem; }
        .fieldLabel { display: block; font-size: 0.85rem; font-weight: 600; color: #1a1a1a; margin-bottom: 0.5rem; }
        .inputWrap { position: relative; display: flex; align-items: center; }
        .inputIcon { position: absolute; left: 12px; display: flex; opacity: 0.55; pointer-events: none; color: #1a1a1a; }

        .input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 2.5rem;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          font-size: 1rem;
          font-family: inherit;
          background: #f7f9f6;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .input:focus { outline: none; border-color: #2e7d32; box-shadow: 0 0 0 3px #e8f5e9; }

        .toggleVisibility {
          position: absolute; right: 8px; background: none; border: none; padding: 6px;
          display: flex; cursor: pointer; color: #5f6368; border-radius: 6px;
        }

        .toggleVisibility:hover { background: #e8f5e9; color: #1b5e20; }

        .errorBanner {
          background: #fdeceA; color: #c62828; padding: 0.75rem 1rem; border-radius: 10px;
          font-size: 0.9rem; margin-bottom: 1.5rem; animation: shake 0.4s ease;
        }

        .submitButton {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.85rem; font-size: 1rem; border-radius: 10px;
          background: #2e7d32; color: #fff; border: none; font-weight: 600; cursor: pointer;
        }

        .submitButton:hover { background: #1b5e20; }
        .submitButton:disabled { background: #e0e0e0; color: #5f6368; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #ffffff; border-radius: 50%; animation: spin 0.7s linear infinite;
        }

        .footerText { text-align: center; margin: 1.5rem 0 0; font-size: 0.9rem; color: #5f6368; }
        .footerLink { color: #1b5e20; font-weight: 600; text-decoration: none; }
        .footerLink:hover { text-decoration: underline; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          10%,90%{transform:translateX(-1px);}
          20%,80%{transform:translateX(2px);}
          30%,50%,70%{transform:translateX(-4px);}
          40%,60%{transform:translateX(4px);}
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}