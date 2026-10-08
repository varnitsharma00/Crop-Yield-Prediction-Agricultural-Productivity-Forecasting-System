# Project Objectives — YieldSense AI

## 1. Problem Statement

Smallholder and commercial farmers across India face significant uncertainty in predicting crop yield due to variable weather, soil conditions, pest pressure, and inconsistent access to agronomic data. Existing decision-support tools are fragmented, not localized to Indian agro-climatic zones, and rarely combine historical yield data with real-time environmental signals. This leads to suboptimal input planning (seed, fertilizer, irrigation), poor risk mitigation, and reduced farm profitability.

**YieldSense AI** aims to close this gap by providing a unified, data-driven platform that forecasts crop yield and agricultural productivity using historical, environmental, and soil data — surfaced through an accessible web interface for farmers, cooperatives, agribusinesses, and government officers.

## 2. Vision

To become a trusted, farmer-first decision-support system that turns fragmented agricultural data into actionable, localized yield predictions and productivity recommendations.

## 3. Core Objectives

| # | Objective | Description |
|---|-----------|--------------|
| O1 | **Accurate Yield Forecasting** | Predict crop yield (tons/hectare) using historical production data, weather, and soil parameters. |
| O2 | **User-Centric Onboarding** | Capture user role, location, and crop preferences to personalize predictions from the first session. |
| O3 | **Multi-Stakeholder Support** | Serve Farmers, Cooperative Members, Agribusinesses, and Government Officers with role-appropriate views. |
| O4 | **Data Integration Layer** | Aggregate and normalize datasets from FAOSTAT, USDA, and Kaggle agricultural sources. |
| O5 | **Scalable ML Pipeline** | Build a preprocessing and feature-engineering pipeline reusable across Scikit-Learn, XGBoost, and TensorFlow models. |
| O6 | **Actionable Analytics** | Provide dashboards and visualizations (Chart.js/Recharts) that translate predictions into farming decisions. |
| O7 | **Secure, Role-Based Access** | Implement authentication and RBAC so data and features are scoped correctly per user type. |
| O8 | **Extensibility for Future Modules** | Architect the system so Weather Analysis, Soil Analysis, Recommendation Engine, and Risk Assessment modules can be added without rework. |

## 4. Milestone-1 Scope

Milestone-1 focuses on **foundation**, not full ML delivery:

- Repository and documentation scaffolding
- System architecture and database design
- UI/UX wireframes and design system
- Backend and frontend project initialization
- Authentication + combined onboarding (account + farm profile creation) across all 5 roles
- Agricultural dataset sourcing plan
- Data preprocessing pipeline (raw → processed)

Model training, weather API integration, and the recommendation engine are explicitly **out of scope** for Milestone-1 and are deferred to later milestones (see `README.md` → Future Roadmap).

## 5. Success Criteria for Milestone-1

- [x] Repository structure matches architecture defined in `system-architecture.md`
- [x] Backend boots (`uvicorn main:app`) with a working `/health` endpoint
- [x] Frontend boots (`npm run dev`) and renders the onboarding flow
- [x] Onboarding endpoint creates the account, farm profile, and issues a valid JWT in one call; RBAC enforced on protected routes
- [x] `preprocess.py` runs end-to-end on a sample raw CSV and outputs a cleaned dataset to `backend/data/processed/`
- [x] All documentation in `docs/` is complete and internally consistent

## 6. Target Users

1. **Farmer** — primary user; wants a simple yield estimate for their crop and land.
2. **Cooperative Member** — manages data for multiple farmer members.
3. **Agribusiness** — needs aggregated regional yield trends for supply planning.
4. **Government Officer** — needs district/state-level productivity analytics for policy planning.

(A 5th role, **Admin**, exists for internal platform operations and is not exposed in the public onboarding flow.)

## 7. Non-Goals (Milestone-1)

- No production deployment (Docker/AWS/Azure is a future milestone)
- No trained ML model in the repo yet — only the pipeline that will feed one
- No mobile app (web-first, responsive design only)
- No persistent database wiring yet — auth/onboarding use an in-memory store as a stand-in (see `system-architecture.md` §8)