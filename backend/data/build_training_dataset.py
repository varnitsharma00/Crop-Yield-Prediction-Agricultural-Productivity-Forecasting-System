import os
import pandas as pd

RAW_PATH = "data/raw/kaggle/yield_df.csv"
OUT_PATH = "data/processed/training_dataset.csv"

# Only the crops your frontend form actually offers — keeps model and UI in sync.
CROP_MAP = {
    "Wheat": "wheat",
    "Rice, paddy": "rice",
    "Maize": "maize",
}

def build():
    df = pd.read_csv(RAW_PATH)

    df = df[df["Item"].isin(CROP_MAP.keys())].copy()
    df["crop_type"] = df["Item"].map(CROP_MAP)

    df = df.rename(columns={
        "average_rain_fall_mm_per_year": "rainfall_mm",
        "avg_temp": "avg_temp_c",
    })

    df["yield_kg_ha"] = df["hg/ha_yield"] / 10.0  # hg/ha -> kg/ha

    out = df[["crop_type", "rainfall_mm", "avg_temp_c", "yield_kg_ha"]].dropna()

    os.makedirs("data/processed", exist_ok=True)
    out.to_csv(OUT_PATH, index=False)
    print(f"Saved {len(out)} rows to {OUT_PATH}")
    print(out["crop_type"].value_counts())

if __name__ == "__main__":
    build()