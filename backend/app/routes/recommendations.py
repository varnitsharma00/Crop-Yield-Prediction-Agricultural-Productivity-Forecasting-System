"""
Recommendation Engine & Risk Assessment Service
Milestone 3 - Task 1, 2 & 3 (Backend & Data Team)
 
Exposes POST /api/v1/analytics/recommendations
 
Design notes for the team:
- Risk is scored numerically (0-100) and then bucketed into Low/Medium/High.
  This replaces the earlier "never downgrades" string-flag approach from the
  original spec, so severity is additive and predictable regardless of the
  order conditions are checked in.
- Keep this file the single source of truth for thresholds. If agronomy
  advisors want different cutoffs (e.g. drought at <250mm instead of <300mm),
  change the constants at the top, not the logic below.
"""
 
from fastapi import APIRouter
 
from app.schemas.analytics import (
    CropType,
    FarmAnalyticsRequest,
    FarmAnalyticsResponse,
    RiskItem,
    RiskLevel,
)
 
router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics & Recommendations"])
 
# --- Thresholds (tweak here, not in the logic below) -----------------------
PH_LOW = 6.0
PH_HIGH = 7.5
NITROGEN_LOW = 50.0
PHOSPHORUS_LOW = 30.0
POTASSIUM_LOW = 40.0
 
RAINFALL_DROUGHT = 300.0
RAINFALL_FLOOD = 1200.0
TEMP_HEAT_STRESS = 35.0
TEMP_SEVERE_HEAT = 40.0
 
# Risk score contribution per condition.
# Any single condition tagged "High" severity should push the overall
# score into the High bucket (>=50) on its own.
SCORE_DROUGHT = 50
SCORE_FLOOD = 25
SCORE_HEAT = 30
SCORE_SEVERE_HEAT_BONUS = 15
 
 
def _score_to_level(score: int) -> RiskLevel:
    if score >= 50:
        return RiskLevel.HIGH
    if score >= 20:
        return RiskLevel.MEDIUM
    return RiskLevel.LOW
 
 
@router.post("/recommendations", response_model=FarmAnalyticsResponse)
def generate_farm_insights(payload: FarmAnalyticsRequest) -> FarmAnalyticsResponse:
    recommendations: list[str] = []
    risks: list[RiskItem] = []
    risk_score = 0
 
    # --- 1. Soil pH recommendation -----------------------------------------
    if payload.soil_ph < PH_LOW:
        recommendations.append(
            f"Apply agricultural lime to raise soil pH to optimal range ({PH_LOW}-{PH_HIGH})."
        )
    elif payload.soil_ph > PH_HIGH:
        recommendations.append("Apply elemental sulfur to lower soil pH.")
    else:
        recommendations.append("Soil pH is optimal. Maintain current organic matter levels.")
 
    # --- 2. NPK nutrient recommendations -----------------------------------
    if payload.nitrogen < NITROGEN_LOW:
        recommendations.append(
            "Low Nitrogen detected: apply Urea or NPK (20-10-10) fertilizer during early growth."
        )
    if payload.phosphorus < PHOSPHORUS_LOW:
        recommendations.append(
            "Low Phosphorus detected: apply DAP (Di-Ammonium Phosphate) to support root development."
        )
    if payload.potassium < POTASSIUM_LOW:
        recommendations.append(
            "Low Potassium detected: apply Muriate of Potash (MOP) to improve drought and disease resistance."
        )
 
    # --- 3. Rainfall risk ----------------------------------------------------
    if payload.rainfall < RAINFALL_DROUGHT:
        risks.append(
            RiskItem(
                type="Drought Stress",
                severity=RiskLevel.HIGH,
                advice="Initiate drip irrigation immediately.",
            )
        )
        risk_score += SCORE_DROUGHT
    elif payload.rainfall > RAINFALL_FLOOD:
        risks.append(
            RiskItem(
                type="Flood / Root Rot",
                severity=RiskLevel.MEDIUM,
                advice="Ensure field drainage paths are clear and consider raised bedding.",
            )
        )
        risk_score += SCORE_FLOOD
 
    # --- 4. Temperature risk --------------------------------------------------
    if payload.avg_temp > TEMP_HEAT_STRESS:
        severity = RiskLevel.HIGH if payload.avg_temp > TEMP_SEVERE_HEAT else RiskLevel.MEDIUM
        risks.append(
            RiskItem(
                type="Heat Stress",
                severity=severity,
                advice="Consider shade netting or shift irrigation to early-morning hours.",
            )
        )
        risk_score += SCORE_HEAT
        if payload.avg_temp > TEMP_SEVERE_HEAT:
            risk_score += SCORE_SEVERE_HEAT_BONUS
 
    risk_score = min(risk_score, 100)
    overall_risk_level = _score_to_level(risk_score)
 
    best_practice_tips = [
        "Rotate crops seasonally to restore soil nutrient balance.",
        "Monitor weekly weather updates for sudden temperature spikes.",
    ]
    if payload.crop_type == CropType.RICE:
        best_practice_tips.append("Maintain consistent standing water depth of 2-5cm during vegetative stage.")
    elif payload.crop_type == CropType.WHEAT:
        best_practice_tips.append("Avoid late sowing; delayed planting sharply reduces wheat yield potential.")
    elif payload.crop_type == CropType.MAIZE:
        best_practice_tips.append("Ensure adequate spacing (60-75cm rows) to reduce inter-plant competition.")
 
    return FarmAnalyticsResponse(
        crop=payload.crop_type,
        overall_risk_level=overall_risk_level,
        risk_score=risk_score,
        identified_risks=risks,
        actionable_recommendations=recommendations,
        best_practice_tips=best_practice_tips,
    )
 