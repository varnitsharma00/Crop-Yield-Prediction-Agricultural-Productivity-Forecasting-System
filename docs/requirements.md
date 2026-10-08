# Requirements — YieldSense AI

## 1. Functional Requirements

### FR-1: User Onboarding
- FR-1.1: System shall allow a new user to select exactly one role: Farmer, Cooperative Member, Agribusiness, Government Officer.
- FR-1.2: System shall capture State and District for the user's farm/region.
- FR-1.3: System shall allow selection of one or more crops from a predefined list (extensible).
- FR-1.4: System shall persist onboarding data (role, location, crops) against the newly created user profile in the **same request** that creates the account.

### FR-2: Authentication & Authorization
- FR-2.1: System shall allow registration with email + password, either standalone (`/api/v1/auth/register`) or bundled into onboarding (`/api/v1/onboarding`).
- FR-2.2: System shall hash passwords using a secure algorithm (bcrypt) before storage.
- FR-2.3: System shall issue JWT access tokens on successful login or onboarding.
- FR-2.4: System shall support role-based access control (RBAC) for 5 roles: `farmer`, `cooperative`, `agribusiness`, `government` (public-facing, selected at onboarding) and `admin` (internal, not exposed at onboarding).
- FR-2.5: System shall reject requests to protected endpoints without a valid JWT.

### FR-3: Data Management
- FR-3.1: System shall ingest raw agricultural datasets (FAOSTAT, USDA, Kaggle) into `backend/data/raw/`.
- FR-3.2: System shall provide a repeatable preprocessing pipeline that cleans, deduplicates, and feature-engineers raw data into `backend/data/processed/`.
- FR-3.3: System shall log preprocessing steps (rows dropped, nulls handled, outliers removed) for auditability.

### FR-4: Yield Prediction (Future Milestone — interfaces defined now)
- FR-4.1: System shall expose an API contract (`/api/v1/predict`) that later milestones implement with a trained model.
- FR-4.2: Prediction request shall accept crop, state, district, season, and optional soil/weather parameters.

### FR-5: Dashboard & Visualization (Future Milestone — scaffolding now)
- FR-5.1: Frontend shall reserve routes/components for yield trend charts using Recharts/Chart.js.

## 2. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-1 | Security | Passwords stored only as bcrypt hashes; JWT secrets loaded from environment variables, never hardcoded. |
| NFR-2 | Performance | API endpoints should respond within 300ms for non-ML requests under normal load. |
| NFR-3 | Scalability | Backend architecture (FastAPI + service layer) should support horizontal scaling behind a load balancer. |
| NFR-4 | Portability | Application must run identically via Docker Compose locally as in future AWS/Azure deployment. |
| NFR-5 | Maintainability | Code organized by domain (routes/models/schemas/services/core) to keep modules independently testable. |
| NFR-6 | Usability | Onboarding flow must be completable in under 60 seconds on mobile viewport widths (360px+). |
| NFR-7 | Data Quality | Preprocessing pipeline must handle missing values, duplicates, and outliers with documented, reproducible logic. |
| NFR-8 | Accessibility | UI must meet WCAG 2.1 AA color contrast minimums (see `design-system.md`). |
| NFR-9 | Extensibility | New crops, roles, and regions must be addable via configuration/reference tables, not code changes. |
| NFR-10 | Auditability | All authentication events (register, login, failed login) should be loggable for future audit trails. |

## 3. Constraints

- Backend: Python 3.11+, FastAPI
- Frontend: Next.js (React) + TypeScript
- Database: PostgreSQL (schema in `database/schema.sql`)
- ML libraries reserved for future milestones: Scikit-Learn, XGBoost, TensorFlow
- Deployment target (future): Docker containers on AWS or Azure

## 4. Assumptions

- Internet connectivity is available for dataset downloads and future weather API calls.
- Users have basic literacy to navigate a guided, icon-supported onboarding flow.
- Initial launch targets Indian states/districts and Rice, Cotton, Wheat, and Maize as starter crops.

## 5. Traceability

| Requirement | Implementing File(s) |
|-------------|------------------------|
| FR-1 | `frontend/app/onboarding/*`, `backend/app/routes/onboarding.py` |
| FR-2 | `backend/app/routes/auth.py`, `backend/app/routes/onboarding.py`, `backend/app/services/jwt_service.py`, `backend/app/services/onboarding_service.py`, `backend/app/core/security.py` |
| FR-3 | `backend/preprocess.py`, `backend/data/raw/`, `backend/data/processed/` |
| FR-4 | `backend/app/routes/` (predict route — future) |
| FR-5 | `frontend/components/` (chart components — future) |