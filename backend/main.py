"""
YieldSense AI — Backend Entry Point
File: backend/main.py
"""

from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, onboarding, predictions, recommendations, dashboard, reports

app = FastAPI(
    title="YieldSense AI API",
    description="Crop Yield Prediction & Agricultural Productivity Forecasting System",
    version="0.1.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(onboarding.router, prefix="/api/v1/onboarding", tags=["Onboarding"])
app.include_router(reports.router, tags=["Reports"])
app.include_router(predictions.router, tags=["Predictions"])
app.include_router(recommendations.router, tags=["Analytics & Recommendations"])
app.include_router(dashboard.router, tags=["Dashboard"])


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": "yieldsense-api", "version": "0.1.0"}


@app.get("/", tags=["System"])
def root():
    return {"message": "Welcome to YieldSense AI API. See /docs for interactive API documentation."}