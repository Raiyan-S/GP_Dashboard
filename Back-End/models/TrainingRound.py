from pydantic import BaseModel, Field, model_validator
from typing import Dict, Any
from datetime import datetime, timezone, timedelta

class Metrics(BaseModel):
    accuracy: float = 0.0
    precision: float = 0.0
    recall: float = 0.0
    f1: float = 0.0
    avg_loss: float = 0.0
    confusion_matrix: list = None  
    per_class_accuracy: Dict[int, Dict[str, Any]] = {}

    @model_validator(mode='before')
    def remove_unwanted_fields(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        # Remove confusion_matrix and per_class_accuracy from each client's metrics
        if 'clients' in values:
            for client_id, client_metrics in values['clients'].items():
                if 'metrics' in client_metrics:
                    # Remove confusion_matrix and per_class_accuracy from each client's metrics
                    client_metrics['metrics']['confusion_matrix'] = None
                    client_metrics['metrics']['per_class_accuracy'] = None
        return values

class ClientMetrics(BaseModel):
    client_id: str
    metrics: Metrics

class TrainingRound(BaseModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=3))  # AST (UTC+3)
    clients: Dict[str, ClientMetrics]  # Use Dict instead of dict[str, ClientMetrics]

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Convert datetime to ISO format string
        }
        populate_by_name = True
        arbitrary_types_allowed = True
