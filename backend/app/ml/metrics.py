import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def evaluate(y_true, y_pred) -> dict:
    return {
        "mae": round(mean_absolute_error(y_true, y_pred), 2),
        "rmse": round(np.sqrt(mean_squared_error(y_true, y_pred)), 2),
        "r2": round(r2_score(y_true, y_pred), 3),
    }

def evaluate_by_crop(crop_labels, y_true, y_pred) -> dict:
    """Breaks accuracy out per crop — catches a crop the blended
    model is quietly bad at."""
    df = pd.DataFrame({"crop": crop_labels.values, "y_true": y_true.values, "y_pred": y_pred})
    results = {}
    for crop, group in df.groupby("crop"):
        results[crop] = evaluate(group["y_true"], group["y_pred"])
    return results