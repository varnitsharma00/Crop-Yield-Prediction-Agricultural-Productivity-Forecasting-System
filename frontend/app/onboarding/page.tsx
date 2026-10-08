// Onboarding flow — Role -> Location -> Role-specific details + Account -> Submit.
// File: frontend/app/onboarding/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../hooks/useOnboarding";
import { ALL_STATES_AND_UTS, DISTRICTS_BY_STATE } from "../../data/indiaLocations";
import type { BusinessType, JurisdictionLevel } from "../../types";

const ROLES = [
  { label: "Farmer", icon: "🧑‍🌾" },
  { label: "Cooperative Member", icon: "🤝" },
  { label: "Agribusiness", icon: "🏢" },
  { label: "Government Officer", icon: "🏛️" },
] as const;

const CROPS = [
  { label: "Rice", icon: "🌾" },
  { label: "Cotton", icon: "🧵" },
  { label: "Wheat", icon: "🌿" },
  { label: "Maize", icon: "🌽" },
] as const;

const BUSINESS_TYPES: BusinessType[] = ["Input Supplier", "Crop Buyer", "Processor", "Other"];
const JURISDICTION_LEVELS: JurisdictionLevel[] = ["District", "State", "National"];

function getFieldError(field: "fullName" | "email" | "password", value: string): string | null {
  if (!value) return null;
  if (field === "fullName" && value.trim().length < 2) return "Enter your full name.";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  if (field === "password" && value.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const {
    step, data, setRole, setLocation, toggleCrop, setAccountField,
    setOrganizationName, setBusinessType, setJurisdictionLevel,
    nextStep, prevStep, isStepValid, submit, submitting, submitError, isDuplicateEmail,
  } = useOnboarding();

  async function handlePrimaryAction() {
    if (step < 3) {
      nextStep();
      return;
    }
    try {
      const response = await submit();
      localStorage.setItem("ys_access_token", response.access_token);
      localStorage.setItem("ys_role", response.role);
      localStorage.setItem(
        "ys_profile",
        JSON.stringify({
          fullName: data.fullName,
          state: data.state,
          district: data.district,
          crops: data.crops,
          organizationName: data.organizationName,
        })
      );
      router.push("/dashboard");
    } catch {
      // submitError already set inside the hook
    }
  }

  const accountFields = (
    <>
      <h2 className="stepTitle" style={{ marginTop: "1.75rem" }}>Create your account</h2>

      <div className="field">
        <label className="fieldLabel">Full name</label>
        <input
          className="input"
          value={data.fullName}
          onChange={(e) => setAccountField("fullName", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
        />
      </div>
      {touched.fullName && getFieldError("fullName", data.fullName) && (
        <p className="fieldError">{getFieldError("fullName", data.fullName)}</p>
      )}

      <div className="field">
        <label className="fieldLabel">Email</label>
        <input
          className="input"
          type="email"
          value={data.email}
          onChange={(e) => setAccountField("email", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />
      </div>
      {touched.email && getFieldError("email", data.email) && (
        <p className="fieldError">{getFieldError("email", data.email)}</p>
      )}

      <div className="field">
        <label className="fieldLabel">Password</label>
        <input
          className="input"
          type="password"
          value={data.password}
          onChange={(e) => setAccountField("password", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        />
      </div>
      {touched.password && getFieldError("password", data.password) && (
        <p className="fieldError">{getFieldError("password", data.password)}</p>
      )}

      {submitError && (
        <div className="errorBanner">
          {submitError}
          {isDuplicateEmail && (
            <>
              {" "}
              <a className="errorLink" href="/login">Log in instead →</a>
            </>
          )}
        </div>
      )}
    </>
  );

  return (
    <main className="page">
      <span className="glyph g1" aria-hidden="true">🌾</span>
      <span className="glyph g2" aria-hidden="true">🌱</span>

      <div className="card">
        <div className="logo">🌾 YieldSense AI</div>

        <div className="progress">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`dot ${step >= n ? "dotActive" : ""}`} />
          ))}
        </div>

        {step === 1 && (
          <section className="stepBody" key="step1">
            <h2 className="stepTitle">Who are you?</h2>
            <p className="stepSubtitle">This shapes your dashboard and recommendations.</p>
            <div className="roleGrid">
              {ROLES.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className={`roleCard ${data.role === label ? "roleCardActive" : ""}`}
                  onClick={() => setRole(label)}
                >
                  <span className="roleIcon">{icon}</span>
                  <span className="roleLabel">{label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="stepBody" key="step2">
            <h2 className="stepTitle">Where is your farm?</h2>
            <p className="stepSubtitle">We'll localize predictions to your region.</p>
            <div className="field">
              <label className="fieldLabel">State</label>
              <select className="input" value={data.state} onChange={(e) => setLocation(e.target.value, "")}>
                <option value="" disabled>Select a state</option>
                {ALL_STATES_AND_UTS.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="fieldLabel">District</label>
              <select
                className="input"
                value={data.district}
                onChange={(e) => setLocation(data.state, e.target.value)}
                disabled={!data.state}
              >
                <option value="" disabled>{data.state ? "Select a district" : "Select a state first"}</option>
                {(DISTRICTS_BY_STATE[data.state] ?? []).map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </section>
        )}

        {step === 3 && data.role === "Farmer" && (
          <section className="stepBody" key="step3-farmer">
            <h2 className="stepTitle">What crops do you grow?</h2>
            <p className="stepSubtitle">Select all that apply.</p>
            <div className="chipRow">
              {CROPS.map(({ label, icon }) => (
                <button key={label} type="button" className={`chip ${data.crops.includes(label) ? "chipActive" : ""}`} onClick={() => toggleCrop(label)}>
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
            {accountFields}
          </section>
        )}

        {step === 3 && data.role === "Cooperative Member" && (
          <section className="stepBody" key="step3-coop">
            <h2 className="stepTitle">Tell us about your cooperative</h2>
            <p className="stepSubtitle">This helps us tailor group-level insights.</p>
            <div className="field">
              <label className="fieldLabel">Cooperative / organization name</label>
              <input className="input" value={data.organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
            </div>
            <div className="field">
              <label className="fieldLabel">Crops your cooperative manages</label>
              <div className="chipRow">
                {CROPS.map(({ label, icon }) => (
                  <button key={label} type="button" className={`chip ${data.crops.includes(label) ? "chipActive" : ""}`} onClick={() => toggleCrop(label)}>
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </div>
            </div>
            {accountFields}
          </section>
        )}

        {step === 3 && data.role === "Agribusiness" && (
          <section className="stepBody" key="step3-agri">
            <h2 className="stepTitle">Tell us about your business</h2>
            <p className="stepSubtitle">We'll surface regional supply trends relevant to you.</p>
            <div className="field">
              <label className="fieldLabel">Company name</label>
              <input className="input" value={data.organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
            </div>
            <div className="field">
              <label className="fieldLabel">Business type</label>
              <select className="input" value={data.businessType} onChange={(e) => setBusinessType(e.target.value as BusinessType)}>
                <option value="" disabled>Select a business type</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="fieldLabel">Crops you work with (optional)</label>
              <div className="chipRow">
                {CROPS.map(({ label, icon }) => (
                  <button key={label} type="button" className={`chip ${data.crops.includes(label) ? "chipActive" : ""}`} onClick={() => toggleCrop(label)}>
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </div>
            </div>
            {accountFields}
          </section>
        )}

        {step === 3 && data.role === "Government Officer" && (
          <section className="stepBody" key="step3-gov">
            <h2 className="stepTitle">Tell us about your role</h2>
            <p className="stepSubtitle">We'll surface district/state-level productivity analytics for you.</p>
            <div className="field">
              <label className="fieldLabel">Department name</label>
              <input className="input" value={data.organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="e.g. Department of Agriculture" />
            </div>
            <div className="field">
              <label className="fieldLabel">Jurisdiction level</label>
              <select className="input" value={data.jurisdictionLevel} onChange={(e) => setJurisdictionLevel(e.target.value as JurisdictionLevel)}>
                <option value="" disabled>Select jurisdiction level</option>
                {JURISDICTION_LEVELS.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            {accountFields}
          </section>
        )}

        <div className="actions">
          {step > 1 ? <button className="backBtn" onClick={prevStep}>← Back</button> : <span />}
          <button className="primaryBtn" disabled={!isStepValid() || submitting} onClick={handlePrimaryAction}>
            {submitting && <span className="spinner" />}
            {submitting ? "Submitting..." : step < 3 ? "Next →" : "Start My Smart Farming Journey 🚜"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .page { position: relative; overflow: hidden; min-height: 100vh; background: #f7f9f6; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .glyph { position: absolute; font-size: 9rem; opacity: 0.06; pointer-events: none; }
        .g1 { top: -2rem; left: -2rem; transform: rotate(-15deg); }
        .g2 { bottom: -3rem; right: -2rem; transform: rotate(20deg); }
        .card { position: relative; z-index: 1; width: 100%; max-width: 560px; background: #ffffff; border-radius: 20px; box-shadow: 0 12px 32px rgba(27, 94, 32, 0.14); padding: 2.5rem 2.25rem; animation: fadeInUp 0.4s ease both; }
        .logo { font-size: 1.15rem; font-weight: 700; color: #1b5e20; margin-bottom: 1.25rem; }
        .progress { display: flex; gap: 8px; margin-bottom: 2rem; }
        .dot { height: 6px; flex: 1; border-radius: 999px; background: #e0e0e0; transition: background 0.3s ease; }
        .dotActive { background: #2e7d32; }
        .stepBody { animation: fadeIn 0.35s ease both; }
        .stepTitle { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.35rem; }
        .stepSubtitle { font-size: 0.9rem; color: #5f6368; margin: 0 0 1.5rem; }
        .roleGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .roleCard { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem 0.75rem; border: 2px solid #e0e0e0; border-radius: 14px; background: #f7f9f6; cursor: pointer; transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease; font-family: inherit; }
        .roleCard:hover { transform: translateY(-2px); }
        .roleCardActive { border-color: #2e7d32; background: #e8f5e9; }
        .roleIcon { font-size: 1.75rem; }
        .roleLabel { font-size: 0.85rem; font-weight: 600; color: #1a1a1a; text-align: center; }
        .field { margin-bottom: 1.25rem; }
        .fieldLabel { display: block; font-size: 0.85rem; font-weight: 600; color: #1a1a1a; margin-bottom: 0.4rem; }
        .input { width: 100%; box-sizing: border-box; padding: 0.7rem 0.9rem; border-radius: 10px; border: 1px solid #e0e0e0; font-size: 1rem; font-family: inherit; background: #f7f9f6; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .input:focus { outline: none; border-color: #2e7d32; box-shadow: 0 0 0 3px #e8f5e9; }
        select.input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235F6368' stroke-width='1.5' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.9rem center; padding-right: 2.5rem; cursor: pointer; }
        select.input:disabled { background-color: #ececec; cursor: not-allowed; color: #999; }
        .fieldError { color: #c62828; font-size: 0.8rem; margin: -0.9rem 0 1rem; }
        .chipRow { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.5rem; }
        .chip { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem; border-radius: 999px; border: 2px solid #e0e0e0; background: #f7f9f6; font-size: 0.9rem; font-weight: 600; color: #1a1a1a; cursor: pointer; font-family: inherit; transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease; }
        .chip:hover { transform: translateY(-1px); }
        .chipActive { border-color: #2e7d32; background: #e8f5e9; color: #1b5e20; }
        .errorBanner { background: #fdeceA; color: #c62828; padding: 0.7rem 1rem; border-radius: 10px; font-size: 0.9rem; margin-top: 1rem; }
        .errorLink { color: #c62828; font-weight: 700; text-decoration: underline; }
        .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
        .backBtn { background: none; border: none; color: #5f6368; font-weight: 600; font-size: 0.95rem; cursor: pointer; padding: 0.6rem 0.5rem; }
        .backBtn:hover { color: #1b5e20; }
        .primaryBtn { display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #1b5e20, #2e7d32); color: #fff; border: none; padding: 0.8rem 1.5rem; font-size: 0.95rem; font-weight: 600; border-radius: 10px; cursor: pointer; box-shadow: 0 6px 16px rgba(27, 94, 32, 0.25); transition: transform 0.15s ease; }
        .primaryBtn:hover:not(:disabled) { transform: translateY(-2px); }
        .primaryBtn:disabled { background: #e0e0e0; color: #5f6368; cursor: not-allowed; box-shadow: none; }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) { .card { padding: 2rem 1.5rem; } .roleGrid { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}