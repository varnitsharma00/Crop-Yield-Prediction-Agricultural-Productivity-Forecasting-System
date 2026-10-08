# System Architecture — YieldSense AI

## 1. Architecture Style

Layered, service-oriented monolith for Milestone-1 (splittable into microservices later): a FastAPI backend organized by domain (routes/models/schemas/services/core), a Next.js frontend consuming a versioned REST API, and a PostgreSQL database. Designed to be containerized (Docker) and cloud-deployed (AWS/Azure) in a later milestone without restructuring.

## 2. High-Level Component Diagram
┌───────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER                            │
│   frontend/ (Next.js + TypeScript)                                  │
│   ├─ app/            Pages & routing (onboarding, login, dashboard) │
│   ├─ components/     Reusable UI (forms, charts, cards)             │
│   ├─ hooks/          Data-fetching & state hooks                    │
│   ├─ services/       API client (fetch wrappers)                    │
│   └─ types/          Shared TypeScript interfaces                   │
└───────────────────────────────┬───────────────────────────────────┘
│ HTTPS / REST (JSON)
▼
┌───────────────────────────────────────────────────────────────────┐
│                             API LAYER                                │
│   backend/app/routes/    FastAPI routers (auth, onboarding, predict...)│
├───────────────────────────────┬───────────────────────────────────┤
│                         APPLICATION LAYER                            │
│   backend/app/services/   Business logic (jwt_service, onboarding_service)│
│   backend/app/core/       Config, security, dependencies            │
├───────────────────────────────┬───────────────────────────────────┤
│                            DATA LAYER                                 │
│   backend/app/models/     ORM models (SQLAlchemy)                   │
│   backend/app/schemas/    Pydantic request/response schemas         │
│   database/schema.sql     PostgreSQL DDL                            │
├───────────────────────────────┬───────────────────────────────────┤
│                          DATA SCIENCE LAYER                          │
│   backend/data/raw/        Source datasets (FAOSTAT/USDA/Kaggle)    │
│   backend/preprocess.py    Cleaning & feature engineering            │
│   backend/data/processed/  Model-ready datasets                     │
└───────────────────────────────────────────────────────────────────┘
## 3. Backend Module Responsibilities

| Module | Responsibility |
|--------|-----------------|
| `app/routes/` | HTTP endpoint definitions; request validation via schemas; delegates to services. No business logic here. |
| `app/models/` | SQLAlchemy ORM classes mapping to PostgreSQL tables. |
| `app/schemas/` | Pydantic models for request/response validation and serialization. |
| `app/services/` | Business logic: authentication, onboarding orchestration, JWT issuance, (future) ML inference. |
| `app/core/` | Cross-cutting concerns: security (hashing, token verification), configuration, dependency injection. |
| `app/utils/` | Stateless helper functions (formatting, validators). |
| `data/raw/`, `data/processed/` | Data science working directories, not served directly by the API. |

## 4. Frontend Module Responsibilities

| Module | Responsibility |
|--------|-----------------|
| `app/` | Route-based pages (Next.js App Router): onboarding, login, dashboard. |
| `components/` | Presentational + composite UI components (buttons, form steppers, charts). |
| `hooks/` | Custom React hooks (`useOnboarding`, future `useAuth`, `useYieldData`). |
| `services/` | Typed API clients wrapping `fetch` calls to the backend. |
| `types/` | Shared TypeScript types/interfaces mirroring backend Pydantic schemas. |
| `public/` | Static assets (icons, logo, illustrations). |

## 5. Request Lifecycle Example — Onboarding (Account + Farm creation)
Frontend (OnboardingPage, step 3 submit)
│  POST /api/v1/onboarding  { full_name, email, password, role, state, district, crops }
▼
routes/onboarding.py       → validates payload against schemas/onboarding.py
│
▼
services/onboarding_service.py → calls register_user() (hash password, create user)
│                              → creates farm record
│                              → issues JWT via core/security.py
▼
Response: { access_token, token_type, role, farm_id, expires_in_minutes }
│
▼
Frontend stores token, redirects to /dashboard
## 6. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript |
| Charting | Recharts, Chart.js |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Auth | JWT (python-jose), Passlib (bcrypt) |
| Data Processing | pandas, numpy |
| Future ML | Scikit-Learn, XGBoost, TensorFlow |
| Future Deployment | Docker, AWS / Azure |

## 7. Environment & Configuration

Configuration is environment-driven via a `.env` file (never committed — see `.gitignore`):
DATABASE_URL=postgresql://user:password@localhost:5432/yieldsense
JWT_SECRET_KEY=change-me-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
Frontend uses `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000/api/v1` if unset).

## 8. Known Milestone-1 Simplifications (tracked for Milestone-2)

- `jwt_service.py` and `onboarding_service.py` use in-memory dictionaries instead of real SQLAlchemy sessions — the `User`/`Role` ORM models and `schema.sql` already exist and define the target shape; swapping the storage layer will not require changing route/schema signatures.
- No Alembic migration folder yet; schema is applied manually via `psql -f`.
- No automated test suite yet (`pytest`/`httpx` are already in `requirements.txt`).
- No Docker Compose file yet.

## 9. Scalability & Future Evolution

- **Milestone-2+**: introduce `services/ml_service.py` for model inference, `routes/predict.py`, `routes/weather.py`, `routes/soil.py`, and swap in-memory stores for real DB sessions + Alembic migrations.
- **Deployment**: each layer becomes containerized (`backend`, `frontend`, `db`) via `docker-compose.yml`; production hosted on AWS (ECS/RDS) or Azure (App Service/Azure DB for PostgreSQL).
- **Caching**: Redis can be introduced for prediction result caching once ML inference is live.