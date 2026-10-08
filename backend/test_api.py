"""
Quick verification tests for the recommendation engine.
Run with: pytest test_api.py -v
"""
 
from fastapi.testclient import TestClient
 
from app.main import app
 
client = TestClient(app)
 
BASE = {
    "crop_type": "Wheat",
    "avg_temp": 25.0,
    "rainfall": 700.0,
    "soil_ph": 6.5,
    "nitrogen": 80.0,
    "phosphorus": 50.0,
    "potassium": 60.0,
}
 
 
def _post(overrides: dict):
    payload = {**BASE, **overrides}
    resp = client.post("/api/v1/analytics/recommendations", json=payload)
    assert resp.status_code == 200, resp.text
    return resp.json()
 
 
def test_health_check():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
 
 
def test_baseline_is_low_risk():
    data = _post({})
    assert data["overall_risk_level"] == "Low"
    assert data["risk_score"] == 0
    assert data["identified_risks"] == []
 
 
def test_low_ph_triggers_lime_recommendation():
    data = _post({"soil_ph": 5.4})
    assert any("lime" in r.lower() for r in data["actionable_recommendations"])
 
 
def test_high_ph_triggers_sulfur_recommendation():
    data = _post({"soil_ph": 8.0})
    assert any("sulfur" in r.lower() for r in data["actionable_recommendations"])
 
 
def test_drought_risk_150mm():
    data = _post({"rainfall": 150.0})
    assert data["overall_risk_level"] == "High"
    assert any(r["type"] == "Drought Stress" for r in data["identified_risks"])
 
 
def test_flood_risk_1400mm():
    data = _post({"rainfall": 1400.0})
    assert any(r["type"] == "Flood / Root Rot" for r in data["identified_risks"])
    assert data["overall_risk_level"] == "Medium"
 
 
def test_heat_stress_38c():
    data = _post({"avg_temp": 38.0})
    heat_risks = [r for r in data["identified_risks"] if r["type"] == "Heat Stress"]
    assert len(heat_risks) == 1
    assert heat_risks[0]["severity"] == "Medium"
 
 
def test_severe_heat_stress_42c_is_high_severity():
    data = _post({"avg_temp": 42.0})
    heat_risks = [r for r in data["identified_risks"] if r["type"] == "Heat Stress"]
    assert heat_risks[0]["severity"] == "High"
 
 
def test_compound_risk_drought_and_heat_stacks_score():
    data = _post({"rainfall": 100.0, "avg_temp": 41.0})
    assert data["overall_risk_level"] == "High"
    assert len(data["identified_risks"]) == 2
    assert data["risk_score"] == 95  # 50 (drought) + 30 (heat) + 15 (severe heat bonus)
 
 
def test_low_npk_triggers_all_three_recommendations():
    data = _post({"nitrogen": 20.0, "phosphorus": 10.0, "potassium": 15.0})
    recs = " ".join(data["actionable_recommendations"]).lower()
    assert "urea" in recs or "npk" in recs
    assert "dap" in recs
    assert "potash" in recs or "mop" in recs
 
 
def test_invalid_ph_rejected():
    resp = client.post("/api/v1/analytics/recommendations", json={**BASE, "soil_ph": 20.0})
    assert resp.status_code == 422
 
 
def test_invalid_crop_type_rejected():
    resp = client.post("/api/v1/analytics/recommendations", json={**BASE, "crop_type": "Banana"})
    assert resp.status_code == 422
 