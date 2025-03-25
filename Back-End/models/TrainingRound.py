from pydantic import BaseModel, Field, model_validator
from datetime import datetime, timezone, timedelta

class Metrics(BaseModel):
    accuracy: float = 0.0
    precision: float = 0.0
    recall: float = 0.0
    f1: float = 0.0
    avg_loss: float = 0.0

class TrainingRound(BaseModel):
    round: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=3))  # AST (UTC+3)
    Global: Metrics
        
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Convert datetime to ISO format string
        }
        populate_by_name = True
        arbitrary_types_allowed = True
        extra = 'allow'
        
    @model_validator(mode='before')
    def check_client_fields(cls, values):
        allowed_fields = ['round', 'Global']
        
        # Ensure that all extra fields have the prefix "client_"
        for field in values:
            if not (field.startswith("client_") or field in allowed_fields):
                raise ValueError(f"Invalid field name: {field}. Field names must start with 'client_'")
        return values