# User Journeys — YieldSense AI

## 1. Primary Journey: New Farmer Onboarding → First Prediction View
[Landing Page]
│
▼
[Onboarding Step 1: Role = Farmer]
│
▼
[Onboarding Step 2: State + District]
│
▼
[Onboarding Step 3: Crops = Rice + Account details (name, email, password)]
│
▼
[Tap: Start My Smart Farming Journey 🚜]
│  POST /api/v1/onboarding (single call: creates account + farm + issues JWT)
▼
[Dashboard Loads] ──▶ [Predicted Yield Card] ──▶ [Yield Trend Chart]
│
▼
[(Future) View Recommendations] ──▶ [(Future) Risk Assessment]
**Success state:** Farmer reaches the dashboard within 3 screens of landing, already authenticated, and sees a yield figure relevant to their crop and district (mocked in Milestone-1, model-driven from Milestone-2).

## 2. Returning User Journey
[Landing Page] ──▶ [Login] ──(POST /api/v1/auth/login)──▶ [JWT stored] ──▶ [Dashboard]
## 3. Failure / Edge Paths

- **Duplicate email at onboarding** → `POST /api/v1/onboarding` returns `409 Conflict`; frontend shows inline error and offers "Log in instead" link.
- **Invalid credentials at login** → `401 Unauthorized`; frontend shows inline error, form stays populated (except password).
- **Expired/invalid JWT on a protected route** → `401 Unauthorized`; frontend clears stored token and redirects to `/login`.
