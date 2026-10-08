# Agricultural Workflow — YieldSense AI

## 1. Purpose

This document describes the end-to-end user and data workflow the platform supports: from a farmer's first visit, through onboarding, to receiving a yield prediction and acting on it.

## 2. High-Level Workflow
┌──────────────┐     ┌───────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Onboarding  │ --> │  Data Input   │ --> │  Yield Prediction │ --> │  Recommendation  │
│ (Account,    │     │ (Land, Soil,  │     │  (ML Inference)   │     │  & Dashboard     │
│  Role, Farm) │     │  Season)      │     │                   │     │  (Future Module) │
└──────────────┘     └───────────────┘     └──────────────────┘     └─────────────────┘
## 3. Step-by-Step Onboarding Flow (Milestone-1 UI)

### Step 1 — Identify User Role
The user selects one role:
- Farmer
- Cooperative Member
- Agribusiness
- Government Officer

This role determines the dashboard variant and RBAC scope (see `requirements.md` and `backend/app/core/security.py`).

### Step 2 — Farm Location
User provides:
- **State**
- **District**

This location maps to agro-climatic zone lookups used later for weather/soil enrichment (future milestone) and for filtering historical FAOSTAT/USDA records relevant to the region.

### Step 3 — Crop Selection + Account Creation
User selects one or more crops they cultivate, from a starter set (Rice, Cotton, Wheat, Maize — expandable via `crop_master`/`crops` reference table, see `database/schema.sql`), and provides account credentials (full name, email, password) in the same step.

### Step 4 — Entry Point
`[ Start My Smart Farming Journey 🚜 ]` submits the **entire** onboarding payload (role + location + crops + credentials) to `POST /api/v1/onboarding` in a single call, which creates the `users` and `farms` records and returns a JWT — routing the user straight to their role-specific dashboard, already authenticated.

## 4. Data Flow Diagram (Conceptual)
┌───────────────────────┐
                 │   External Datasets   │
                 │ FAOSTAT / USDA / Kaggle│
                 └───────────┬───────────┘
                             │  ingest (manual/scripted)
                             ▼
                 ┌───────────────────────┐
                 │  backend/data/raw/     │
                 └───────────┬───────────┘
                             │  preprocess.py
                             ▼
                 ┌───────────────────────┐
                 │ backend/data/processed/│
                 └───────────┬───────────┘
                             │  future: model training
                             ▼
    ┌────────────────────────────────────────────┐
    │              Prediction Service              │
    │   (Scikit-Learn / XGBoost / TensorFlow)       │
    └───────────────────┬────────────────────────┘
                         │  REST API (FastAPI)
                         ▼
    ┌────────────────────────────────────────────┐
    │          Frontend Dashboard (Next.js)         │
    │   Charts (Recharts/Chart.js) + Recommendations │
    └────────────────────────────────────────────┘
                         ▲│  onboarding (account + farm + auth, one step)
┌────────────────────────────────────────────┐
│      User (Farmer / Coop / Agribusiness /     │
│              Government Officer)              │
└────────────────────────────────────────────┘
## 5. User Journey Map (Farmer Persona)

| Stage | User Action | System Response | Emotion Goal |
|-------|-------------|------------------|---------------|
| Discover | Opens app for first time | Shows welcome screen with role selection | Curious, not overwhelmed |
| Onboard | Selects role, state, district, crops, creates account | Persists profile + issues JWT, shows loading → dashboard | Confident, quick |
| Explore | Views predicted yield for selected crop | Shows prediction card + trend chart | Informed |
| Decide | Compares yield across crops/seasons | Shows comparison table/chart | Empowered |
| Return | Logs in next season | Loads saved farm profile, prompts data refresh | Trusted, efficient |

## 6. Post-Milestone-1 Workflow Extensions

- **Weather Analysis module** enriches farm records with live/forecast weather.
- **Soil Analysis module** allows manual entry or lab-report upload of soil parameters (pH, N-P-K, moisture).
- **Recommendation Engine** converts yield prediction + risk score into actionable advice (e.g., irrigation timing, fertilizer dosage).
- **Risk Assessment module** flags drought/flood/pest risk per region per season.

