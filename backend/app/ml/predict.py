import joblib
import pandas as pd

from app.ml.preprocessing import build_features, FEATURE_COLUMNS

_model = None
MODEL_VERSION = "yield_model_v1"

def get_model():
    global _model
    if _model is None:
        _model = joblib.load("models/yield_model_v1.joblib")
    return _model

def predict_yield(payload: dict) -> float:
    df = pd.DataFrame([payload])
    features = build_features(df)[FEATURE_COLUMNS]
    model = get_model()
    return float(model.predict(features)[0])