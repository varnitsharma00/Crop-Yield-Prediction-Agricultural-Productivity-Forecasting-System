from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    PredictionHistoryResponse,
)
from app.ml.predict import predict_yield, MODEL_VERSION
from app.modules.soil_service import suitability_score
from app.modules.geocoding_service import get_coordinates
from app.modules.weather_service import WeatherService
from app.core.security import get_current_user
from app.db.session import get_db
from app.models.prediction import Prediction

router = APIRouter(prefix="/api/v1/predictions", tags=["predictions"])


@router.post("", response_model=PredictionResponse)
async def create_prediction(
    payload: PredictionRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        lat, lon = await get_coordinates(payload.region)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        weather_service = WeatherService()
        weather = await weather_service.get_current_conditions(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather lookup failed: {e}")

    try:
        model_input = {
            "crop_type": payload.crop_type,
            "rainfall_mm": weather["rainfall_mm"],
            "avg_temp_c": weather["avg_temp_c"],
        }
        yield_kg_ha = predict_yield(model_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    soil_score = suitability_score(
        payload.crop_type, payload.soil_ph,
        payload.nitrogen_kg_ha, payload.phosphorus_kg_ha, payload.potassium_kg_ha,
    )

    record = Prediction(
        user_id=current_user["user_id"],
        crop_type=payload.crop_type,
        region=payload.region,
        rainfall_mm=weather["rainfall_mm"],
        avg_temp_c=weather["avg_temp_c"],
        humidity_pct=weather.get("humidity_pct", 0.0),
        soil_ph=payload.soil_ph,
        nitrogen_kg_ha=payload.nitrogen_kg_ha,
        phosphorus_kg_ha=payload.phosphorus_kg_ha,
        potassium_kg_ha=payload.potassium_kg_ha,
        predicted_yield_kg_ha=round(yield_kg_ha, 1),
        soil_suitability_score=soil_score,
        model_version=MODEL_VERSION,
    )
    db.add(record)
    db.commit()

    return PredictionResponse(
        predicted_yield_kg_ha=round(yield_kg_ha, 1),
        soil_suitability_score=soil_score,
        model_version=MODEL_VERSION,
    )


@router.get("/history", response_model=PredictionHistoryResponse)
def get_prediction_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user["user_id"])
        .order_by(Prediction.created_at.asc())
        .all()
    )
    return PredictionHistoryResponse(predictions=records)