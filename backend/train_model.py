# backend/train_model.py
import pandas as pd
from xgboost import XGBRegressor
import joblib

data = pd.read_csv("data/crop_data.csv")
X = data.drop("yield", axis=1)
y = data["yield"]

model = XGBRegressor(n_estimators=200, max_depth=6, learning_rate=0.1)
model.fit(X, y)

joblib.dump(model, "models/yield_model.pkl")
print("Model trained and saved.")