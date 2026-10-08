YieldSense AI — Milestone 3 Backend (Recommendation Engine & Risk Assessment)
Run it
bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
API docs (Swagger UI): http://localhost:8000/docs
Health check: http://localhost:8000/health
Endpoint

POST /api/v1/analytics/recommendations

Request
json
{
  "crop_type": "Wheat",
  "avg_temp": 32.5,
  "rainfall": 180.0,
  "soil_ph": 5.4,
  "nitrogen": 35.0,
  "phosphorus": 40.0,
  "potassium": 60.0
}

crop_type must be one of: Wheat, Rice, Maize. Out-of-range values (e.g. soil_ph: 20) are rejected with a 422 and a clear validation message — the frontend form should surface these directly.

Response
json
{
  "crop": "Wheat",
  "overall_risk_level": "High",
  "risk_score": 50,
  "identified_risks": [
    {
      "type": "Drought Stress",
      "severity": "High",
      "advice": "Initiate drip irrigation immediately."
    }
  ],
  "actionable_recommendations": [
    "Apply agricultural lime to raise soil pH to optimal range (6.0-7.5).",
    "Low Nitrogen detected: apply Urea or NPK (20-10-10) fertilizer during early growth."
  ],
  "best_practice_tips": [
    "Rotate crops seasonally to restore soil nutrient balance.",
    "Monitor weekly weather updates for sudden temperature spikes.",
    "Avoid late sowing; delayed planting sharply reduces wheat yield potential."
  ]
}

Frontend team: overall_risk_level is one of Low / Medium / High — map directly to your Green / Yellow / Red badge colors. risk_score (0-100) is also included if you want a numeric gauge instead of/alongside the badge.

Thresholds

All tunable thresholds (drought rainfall cutoff, heat stress temp, pH range, etc.) live at the top of app/routers/recommendations.py. Change the constants there — don't touch the logic below them — if agronomy advisors want different cutoffs.

Tests
bash
python -m pytest test_api.py -v

12 tests covering: baseline low-risk case, pH-based recommendations (both directions), NPK deficiency recommendations, drought/flood/heat risk triggers (including a compound multi-risk case), and input validation rejection.

CORS

app/main.py currently allows http://localhost:3000 (default Next.js/CRA dev port). Update allow_origins before deploying to point at your real frontend URL.

Next steps for Milestone 3
Frontend team: build against this contract using mock data first (see the example JSON above), then swap in real fetch calls.
Full-stack: the /export-csv reporting endpoint (Task 6, Option B) is not yet built — this router only covers Tasks 1-3.