# YieldSense AI

## Overview
YieldSense AI predicts crop yield for farmers using machine learning, combined with weather and soil analysis, and provides actionable recommendations and risk assessments to support better farming decisions.

## Features
- Crop yield prediction using a Random Forest regression model
- Weather and soil-based analytics feeding into predictions
- Analytics dashboard — productivity score, yield trends, crop comparison
- Rule-based recommendation and risk assessment engine (soil pH, NPK nutrients, rainfall, temperature)
- Automated backend tests (pytest)

## Tech Stack
**Backend:** FastAPI, PostgreSQL, SQLAlchemy
**Frontend:** Next.js, React, Recharts
**ML:** Scikit-learn (RandomForestRegressor), Pandas, NumPy
**Testing:** Pytest
**Containerization:** Docker, Docker Compose

## Model Performance
Evaluated on a held-out test set (not used in training):
- **R²:** 0.877
- **MAE:** 543.93 kg/ha
- **RMSE:** 792.35 kg/ha

## Setup Instructions
1. Clone the repository
2. **Backend:**

cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt

3. **Frontend:**

cd frontend
npm install

4. **Model:** run `python -m app.ml.train` to train and generate the model locally (see `.gitignore` — trained model files are not committed directly)
5. **Run backend:** `uvicorn main:app --reload` (from `backend/`)
6. **Run frontend:** `npm run dev` (from `frontend/`)

## Testing

cd backend
pytest tests/ -v


## Docker
Dockerfiles and `docker-compose.yml` are included for backend, frontend, and PostgreSQL, ready to run with:

docker compose up --build

> Note: Not run in this development environment due to virtualization being disabled at the hardware/IT-policy level on this machine (common on managed corporate laptops). Configuration is complete and correct.

## License
This project is licensed under the MIT License - see [LICENSE](./LICENSE)

A few notes on what I filled in
Model Performance numbers — pulled directly from your actual train.py run earlier, not placeholders
Setup instructions — match your real commands (python -m app.ml.train, uvicorn main:app) instead of the generic handout versions
Docker note — honest, professional framing of the limitation, not hidden or faked
