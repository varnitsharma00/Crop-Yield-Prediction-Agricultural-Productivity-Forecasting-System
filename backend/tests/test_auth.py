"""
Minimal smoke tests for auth + onboarding endpoints.
File: backend/tests/test_auth.py
Run with: pytest tests/ (from the backend/ directory, with the venv active)
"""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register_and_login():
    email = "test.farmer@example.com"
    register_resp = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test Farmer",
            "email": email,
            "password": "supersecret",
            "role": "farmer",
        },
    )
    assert register_resp.status_code == 201
    assert register_resp.json()["role"] == "farmer"

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "supersecret"},
    )
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()


def test_onboarding_creates_account_and_farm():
    response = client.post(
        "/api/v1/onboarding/",
        json={
            "full_name": "Ramesh Kumar",
            "email": "ramesh@example.com",
            "password": "supersecret",
            "role": "farmer",
            "state": "Telangana",
            "district": "Krishna",
            "crops": ["Rice", "Cotton"],
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert "access_token" in body
    assert "farm_id" in body