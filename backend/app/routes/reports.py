"""
Reports route: export the current user's prediction history as CSV.
File: backend/app/routes/reports.py
"""

import io

import pandas as pd
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.prediction import Prediction

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])


@router.get("/export-csv")
def export_predictions_csv(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Export the current user's full prediction history as a downloadable CSV."""
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user["user_id"])
        .order_by(Prediction.created_at.asc())
        .all()
    )

    rows = [
        {
            "id": r.id,
            "crop_type": r.crop_type,
            "region": r.region,
            "predicted_yield_kg_ha": r.predicted_yield_kg_ha,
            "soil_suitability_score": r.soil_suitability_score,
            "model_version": r.model_version,
            "created_at": r.created_at,
        }
        for r in records
    ]

    df = pd.DataFrame(rows)
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)

    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=yieldsense_predictions.csv"},
    )