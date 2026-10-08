"""
Pydantic schemas for the Analytics & Recommendations service.
 
Keeping schemas in their own module (rather than inline in the router)
so the frontend team has a single file to read when they need to know
the exact request/response contract.
"""
 
from enum import Enum
from typing import List, Optional
 
from pydantic import BaseModel, Field
 
 
class CropType(str, Enum):
    WHEAT = "Wheat"
    RICE = "Rice"
    MAIZE = "Maize"
 
 
class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
 
 
class FarmAnalyticsRequest(BaseModel):
    crop_type: CropType
    avg_temp: float = Field(..., ge=-10, le=60, description="Average temperature in Celsius")
    rainfall: float = Field(..., ge=0, le=5000, description="Rainfall in mm for the period")
    soil_ph: float = Field(..., ge=0, le=14, description="Soil pH")
    nitrogen: float = Field(..., ge=0, le=500, description="Nitrogen level (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=500, description="Phosphorus level (kg/ha)")
    potassium: float = Field(..., ge=0, le=500, description="Potassium level (kg/ha)")
 
    class Config:
        json_schema_extra = {
            "example": {
                "crop_type": "Wheat",
                "avg_temp": 32.5,
                "rainfall": 180.0,
                "soil_ph": 5.4,
                "nitrogen": 35.0,
                "phosphorus": 40.0,
                "potassium": 60.0,
            }
        }
 
 
class RiskItem(BaseModel):
    type: str
    severity: RiskLevel
    advice: str
 
 
class FarmAnalyticsResponse(BaseModel):
    crop: CropType
    overall_risk_level: RiskLevel
    risk_score: int = Field(..., description="0-100 numeric score, higher = more risk")
    identified_risks: List[RiskItem]
    actionable_recommendations: List[str]
    best_practice_tips: List[str]
 