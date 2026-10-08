# Agricultural Datasets — Sourcing Guide

File location: `backend/data/raw/README.md`
Applies to subfolders: `faostat/`, `usda/`, `kaggle/`

## 1. Why These Three Sources

| Source | Why It's Used | Coverage |
|--------|-----------------|----------|
| **FAOSTAT** (Food and Agriculture Organization) | Authoritative, free, long-running (60+ years) global crop production statistics by country/year. Good for cross-country baselines and validating trends. | Country-level, global |
| **USDA** (U.S. Department of Agriculture — NASS/FAS) | High-quality structured data with strong documentation; useful for comparative international benchmarks and methodology reference (yield calculation standards). | Country/state-level (US), global trade data |
| **Kaggle** (India-specific agriculture datasets, e.g. "Crop Production in India", "India Agriculture Crop Yield") | Provides **district-level, India-specific** granularity that FAOSTAT/USDA lack — critical since YieldSense AI targets Indian states/districts. | District/state-level, India |

Combining global (FAOSTAT/USDA) with local (Kaggle India) data lets the model learn general yield patterns while being fine-tuned/validated on the district-level granularity the product actually needs.

## 2. What to Download

### `faostat/`
- Dataset: **"Crops and livestock products"** → Production quantity, Area harvested, Yield.
- Filter: Crops = Rice (paddy), Wheat, Maize, Cotton (seed cotton); Country = India; Years = as far back as available.
- Source: FAOSTAT bulk download service (CSV format).
- Expected filename convention: `faostat_production_india_<crop>_<year_range>.csv`

### `usda/`
- Dataset: **PSD (Production, Supply and Distribution) Online** for Rice, Wheat, Corn (Maize), Cotton — India records.
- Source: USDA FAS PSD Online (CSV export).
- Expected filename convention: `usda_psd_india_<crop>.csv`

### `kaggle/`
- Dataset candidates: "Crop Production in India" / "India Agriculture Crop Yield" (district/state/season granularity).
- Source: Kaggle dataset download (requires Kaggle API/account).
- Expected filename convention: `kaggle_crop_yield_india_<year_range>.csv`

> **Note:** Raw files are **not committed** to version control (see root `.gitignore`) due to size and licensing; only this guide and the folder structure are tracked. Each contributor downloads datasets locally into these folders before running `preprocess.py`.

## 3. Expected CSV Structures (Normalized Target)

Regardless of source, `preprocess.py` normalizes each raw file toward this common shape before merging:

| Column | Type | Description |
|--------|------|-------------|
| `crop` | string | Standardized crop name (Rice, Wheat, Maize, Cotton) |
| `state` | string | State name (India-specific sources) or country (FAOSTAT/USDA) |
| `district` | string \| null | District name (Kaggle only; null for FAOSTAT/USDA) |
| `year` | int | Harvest year |
| `area_harvested_ha` | float | Area harvested, hectares |
| `production_tonnes` | float | Total production, metric tonnes |
| `yield_kg_per_ha` | float | Yield — production / area, in kg/ha |
| `source` | string | `'FAOSTAT'`, `'USDA'`, or `'Kaggle'` |

Raw source-specific column names (examples encountered in practice) that get mapped during preprocessing:

- FAOSTAT: `Area`, `Item`, `Year`, `Value`, `Element` (Area harvested / Production / Yield — pivoted)
- USDA PSD: `Country_Name`, `Commodity_Description`, `Market_Year`, `Attribute_Description`, `Value`
- Kaggle: `State_Name`, `District_Name`, `Crop_Year`, `Season`, `Crop`, `Area`, `Production`

## 4. How This Supports Future ML Models

- **Feature diversity**: combining global and district-level data gives the model both macro trend features (year-over-year national trends) and micro features (district-specific yield variance).
- **Validation strategy**: FAOSTAT/USDA aggregates can be used to sanity-check that district-level Kaggle data sums reasonably to state/country totals.
- **Transfer potential**: a model pretrained on FAOSTAT's long time series (60+ years) can be fine-tuned on India-specific district data, mitigating the smaller sample size of Kaggle datasets.
- **Source-aware feature engineering**: the retained `source` column allows the pipeline (and later the model) to account for measurement/methodology differences between sources rather than treating them as a single homogeneous dataset.