-- ============================================================
-- YieldSense AI — PostgreSQL Schema (Milestone-1)
-- File: database/schema.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Reference table: roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    role_id         SERIAL PRIMARY KEY,
    role_name       VARCHAR(30) NOT NULL UNIQUE   -- 'farmer', 'admin', 'cooperative', 'agribusiness', 'government'
);

INSERT INTO roles (role_name) VALUES
    ('farmer'), ('admin'), ('cooperative'), ('agribusiness'), ('government')
ON CONFLICT (role_name) DO NOTHING;

-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(120) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role_id         INTEGER NOT NULL REFERENCES roles(role_id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ------------------------------------------------------------
-- Reference table: crops
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crops (
    crop_id         SERIAL PRIMARY KEY,
    crop_name       VARCHAR(60) NOT NULL UNIQUE   -- 'Rice', 'Cotton', 'Wheat', 'Maize', ...
);

INSERT INTO crops (crop_name) VALUES
    ('Rice'), ('Cotton'), ('Wheat'), ('Maize')
ON CONFLICT (crop_name) DO NOTHING;

-- ------------------------------------------------------------
-- Reference table: locations (state/district)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    location_id     SERIAL PRIMARY KEY,
    state           VARCHAR(80) NOT NULL,
    district        VARCHAR(80) NOT NULL,
    UNIQUE (state, district)
);

-- ------------------------------------------------------------
-- Farms — one user (farmer) can register one or more farms
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farms (
    farm_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    location_id     INTEGER NOT NULL REFERENCES locations(location_id),
    farm_size_ha    NUMERIC(10,2),                 -- optional, hectares
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Farm ↔ Crop (many-to-many): crops grown per farm
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farm_crops (
    farm_id         UUID NOT NULL REFERENCES farms(farm_id) ON DELETE CASCADE,
    crop_id         INTEGER NOT NULL REFERENCES crops(crop_id),
    season          VARCHAR(20),                   -- 'Kharif', 'Rabi', 'Zaid'
    PRIMARY KEY (farm_id, crop_id, season)
);

-- ------------------------------------------------------------
-- Historical yield records (ingested from FAOSTAT / USDA / Kaggle)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS yield_records (
    record_id       BIGSERIAL PRIMARY KEY,
    crop_id         INTEGER NOT NULL REFERENCES crops(crop_id),
    location_id     INTEGER NOT NULL REFERENCES locations(location_id),
    year            INTEGER NOT NULL,
    area_harvested_ha  NUMERIC(14,2),
    production_tonnes  NUMERIC(14,2),
    yield_kg_per_ha     NUMERIC(14,2),
    source          VARCHAR(30) NOT NULL,          -- 'FAOSTAT', 'USDA', 'Kaggle'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_yield_crop_location_year
    ON yield_records (crop_id, location_id, year);

-- ------------------------------------------------------------
-- Predictions (populated once ML service is live — future milestone)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS predictions (
    prediction_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id         UUID NOT NULL REFERENCES farms(farm_id) ON DELETE CASCADE,
    crop_id         INTEGER NOT NULL REFERENCES crops(crop_id),
    predicted_yield_kg_per_ha  NUMERIC(14,2),
    confidence_score           NUMERIC(5,4),
    model_version               VARCHAR(30),
    predicted_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Audit log for authentication events
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_audit_log (
    log_id          BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(user_id) ON DELETE SET NULL,
    event_type      VARCHAR(30) NOT NULL,          -- 'REGISTER', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'
    ip_address      VARCHAR(45),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);