from pydantic import BaseModel, Field, model_validator
from datetime import datetime, timezone, timedelta

class Metrics(BaseModel):
    accuracy: float = 0.0
    precision: float = 0.0
    recall: float = 0.0
    f1: float = 0.0
    avg_loss: float = 0.0
    
    @model_validator(mode='before')
    def remove_unwanted_fields(cls, values):
        # Remove the unwanted fields if they exist
        for client, metrics in values.get('clients', {}).items():
            if 'confusion_matrix' in metrics:
                del metrics['confusion_matrix']
            if 'per_class_accuracy' in metrics:
                del metrics['per_class_accuracy']
        return values
    
class ClientMetrics(BaseModel):
    client_id: str
    metrics: Metrics

class TrainingRound(BaseModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=3))  # AST (UTC+3) Current date and time
    clients: dict[str, ClientMetrics]  # Dictionary to hold client-specific metrics for each round

    # Pydantic configuration
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Convert datetime to ISO format string
        }
        populate_by_name = True
        arbitrary_types_allowed = True
