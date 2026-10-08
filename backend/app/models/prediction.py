from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, index=True)  # NEW
    crop_type = Column(String, nullable=False)
    region = Column(String, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    avg_temp_c = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    soil_ph = Column(Float, nullable=False)
    nitrogen_kg_ha = Column(Float, nullable=False)
    phosphorus_kg_ha = Column(Float, nullable=False)
    potassium_kg_ha = Column(Float, nullable=False)
    predicted_yield_kg_ha = Column(Float, nullable=False)
    soil_suitability_score = Column(Float, nullable=False)
    model_version = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())