from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict, Field


class PredictionRequest(BaseModel):
    crop_type: str
    region: str
    soil_ph: float = Field(..., ge=0, le=14)
    nitrogen_kg_ha: float = Field(..., ge=0)
    phosphorus_kg_ha: float = Field(..., ge=0)
    potassium_kg_ha: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    predicted_yield_kg_ha: float
    soil_suitability_score: float
    model_version: str


class PredictionHistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: int
    crop_type: str
    region: str
    predicted_yield_kg_ha: float
    soil_suitability_score: float
    model_version: str
    created_at: datetime


class PredictionHistoryResponse(BaseModel):
    predictions: List[PredictionHistoryItem]