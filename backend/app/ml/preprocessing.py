import pandas as pd

FEATURE_COLUMNS = ["rainfall_mm", "avg_temp_c", "crop_type_encoded"]
TARGET_COLUMN = "yield_kg_ha"

# Fixed mapping — NOT recomputed per batch. Must match at train time and inference time.
CROP_MAPPING = {"wheat": 0, "rice": 1, "maize": 2}

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["crop_type_encoded"] = df["crop_type"].map(CROP_MAPPING)

    if df["crop_type_encoded"].isnull().any():
        unknown = df.loc[df["crop_type_encoded"].isnull(), "crop_type"].unique()
        raise ValueError(f"Unknown crop_type(s): {list(unknown)}")

    cols = FEATURE_COLUMNS + [TARGET_COLUMN] if TARGET_COLUMN in df.columns else FEATURE_COLUMNS
    return df[cols]