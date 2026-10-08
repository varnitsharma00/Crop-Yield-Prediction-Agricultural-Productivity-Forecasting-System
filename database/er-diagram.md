# ER Diagram — YieldSense AI

## 1. Entity-Relationship Overview
┌────────────┐        ┌────────────┐        ┌────────────┐
│   roles    │1      │   users    │1      │   farms    │
├────────────┤────────├────────────┤────────├────────────┤
│ role_id PK │        │ user_id PK │        │ farm_id PK │
│ role_name  │        │ full_name  │        │ user_id FK │
└────────────┘        │ email      │        │ location_id FK│
│ hashed_pw  │        │ farm_size_ha│
│ role_id FK │        └─────┬──────┘
│ is_active  │              │
└────────────┘              │
│
┌────────────┐        ┌──────┴──────┐
│ locations  │1      │ farm_crops  │      1┌────────────┐
├────────────┤────────├─────────────┤────────┤   crops    │
│location_id PK│      │ farm_id FK  │        ├────────────┤
│ state      │        │ crop_id FK  │        │ crop_id PK │
│ district   │        │ season      │        │ crop_name  │
└─────┬──────┘        └─────────────┘        └─────┬──────┘
│1                                            │1
│                                            │*
┌─────┴────────────┐                       ┌───────┴────────┐
│  yield_records    │──────────────────────│  predictions    │
├───────────────────┤                       ├─────────────────┤
│ record_id PK      │                       │ prediction_id PK│
│ crop_id FK        │                       │ farm_id FK      │
│ location_id FK    │                       │ crop_id FK      │
│ year              │                       │ predicted_yield │
│ area_harvested_ha │                       │ confidence_score│
│ production_tonnes │                       │ model_version   │
│ yield_kg_per_ha   │                       └─────────────────┘
│ source            │
└───────────────────┘┌───────────────────┐
                   │  auth_audit_log    │
                   ├───────────────────┤
                   │ log_id PK          │
                   │ user_id FK (nullable)│
                   │ event_type         │
                   │ ip_address         │
                   └───────────────────┘
## 2. Relationship Summary

| Relationship | Cardinality | Notes |
|--------------|-------------|-------|
| roles → users | 1 : N | Each user has exactly one role. |
| users → farms | 1 : N | A farmer/cooperative user can register multiple farms. |
| locations → farms | 1 : N | Each farm belongs to one state/district. |
| farms ↔ crops | M : N (via `farm_crops`) | A farm can grow multiple crops across seasons; a crop can be grown on many farms. |
| crops → yield_records | 1 : N | Historical yield rows per crop. |
| locations → yield_records | 1 : N | Historical yield rows per location. |
| farms → predictions | 1 : N | A farm can have multiple predictions over time (per crop/season). |
| users → auth_audit_log | 1 : N | Every login/register attempt is logged. |

## 3. Design Notes

- `users.role_id` drives RBAC checks in `backend/app/core/security.py`.
- `yield_records.source` distinguishes FAOSTAT/USDA/Kaggle provenance so preprocessing can apply source-specific cleaning rules.
- `predictions` table is defined now (Milestone-1) but populated starting Milestone-2 once the ML service exists — this avoids a schema migration later.
- UUID primary keys (`users`, `farms`, `predictions`) are used for entities exposed via public APIs to avoid sequential ID enumeration; `SERIAL`/`BIGSERIAL` is used for internal reference/log tables where enumeration risk is irrelevant.
- The Milestone-1 `POST /api/v1/onboarding` endpoint conceptually writes to `users` + `farms` + `farm_crops` in one transaction; today it's simulated with in-memory dicts (see `system-architecture.md` §8) using the exact same field names, so swapping in real DB writes later is a drop-in change.