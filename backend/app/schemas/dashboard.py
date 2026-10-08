"""
Pydantic schemas for the dashboard summary endpoint.
File: backend/app/schemas/dashboard.py

Matches the response shape specified in the Week 5 mentor handout:
    { "yield_trend": [{"season": ..., "yield": ...}, ...], "productivity_score": ... }

Note: "yield" is a reserved Python keyword, so the field is named `yield_`
internally with an alias of "yield" for JSON output -- FastAPI serializes
using the alias by default, so the wire format matches the spec exactly.
"""

from typing import List

from pydantic import BaseModel, Field


class YieldTrendPoint(BaseModel):
    model_config = {"populate_by_name": True}
    season: str
    yield_: float = Field(..., alias="yield")


class CropComparisonPoint(BaseModel):
    model_config = {"populate_by_name": True}
    name: str
    yield_: float = Field(..., alias="yield")


class DashboardSummaryResponse(BaseModel):
    yield_trend: List[YieldTrendPoint]
    productivity_score: float
    crop_comparison: List[CropComparisonPoint]
