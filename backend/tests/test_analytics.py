"""
Smoke tests for the Analytics & Recommendations endpoint.
File: backend/tests/test_analytics.py
Run with: pytest tests/ (from the backend/ directory, with the venv active)
"""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_recommendations_drought_risk():
    response = client.post(
        "/api/v1/analytics/recommendations",
        json={
            "crop_type": "Wheat",
            "avg_temp": 32.5,
            "rainfall": 180.0,
            "soil_ph": 5.4,
            "nitrogen": 35.0,
            "phosphorus": 40.0,
            "potassium": 60.0,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["overall_risk_level"] == "High"
    assert body["risk_score"] >= 50
    assert any(risk["type"] == "Drought Stress" for risk in body["identified_risks"])


def test_recommendations_low_risk():
    response = client.post(
        "/api/v1/analytics/recommendations",
        json={
            "crop_type": "Rice",
            "avg_temp": 28.0,
            "rainfall": 800.0,
            "soil_ph": 6.5,
            "nitrogen": 100.0,
            "phosphorus": 80.0,
            "potassium": 90.0,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["overall_risk_level"] == "Low"
    assert body["identified_risks"] == []


def test_recommendations_invalid_payload():
    response = client.post(
        "/api/v1/analytics/recommendations",
        json={"crop_type": "Wheat"},  # missing required fields
    )
    assert response.status_code == 422