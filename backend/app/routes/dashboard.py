"""
Dashboard summary route.
File: backend/app/routes/dashboard.py

Reuses the same prediction history data as /api/v1/predictions/history,
reshaped to match the Week 5 mentor handout's expected response:
    { "yield_trend": [...], "productivity_score": ... }

DEVIATION FROM HANDOUT (documented, not hidden):
The handout's sample code scopes data by `farm_id`. This project's current
data model ties predictions to `user_id` (the logged-in farmer), not a
`farm_id` — farm profiles created during onboarding are not yet DB-backed
(see app/services/onboarding_service.py, still using _FAKE_FARM_DB).
Until that's wired up, this endpoint scopes to "predictions belonging to
the logged-in user" as the practical equivalent of "one farm". This should
be revisited once onboarding's farm profiles are persisted for real.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.prediction import Prediction
from app.schemas.dashboard import DashboardSummaryResponse, YieldTrendPoint, CropComparisonPoint

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user["user_id"])
        .order_by(Prediction.created_at.asc())
        .all()
    )

    if not records:
        return DashboardSummaryResponse(
            yield_trend=[],
            productivity_score=0.0,
            crop_comparison=[],
        )

    yield_trend = [
        YieldTrendPoint(
            season=r.created_at.strftime("%b %Y"),
            yield_=r.predicted_yield_kg_ha,
        )
        for r in records
    ]

    avg_yield = sum(r.predicted_yield_kg_ha for r in records) / len(records)
    latest_yield = records[-1].predicted_yield_kg_ha
    productivity_score = round((latest_yield / avg_yield) * 100, 1) if avg_yield else 0.0

    # Average predicted yield per crop type, for the comparison chart
    from collections import defaultdict
    crop_totals: dict[str, list[float]] = defaultdict(list)
    for r in records:
        crop_totals[r.crop_type].append(r.predicted_yield_kg_ha)

    crop_comparison = [
        CropComparisonPoint(name=crop.capitalize(), yield_=round(sum(yields) / len(yields), 1))
        for crop, yields in crop_totals.items()
    ]

    return DashboardSummaryResponse(
        yield_trend=yield_trend,
        productivity_score=productivity_score,
        crop_comparison=crop_comparison,
    )
