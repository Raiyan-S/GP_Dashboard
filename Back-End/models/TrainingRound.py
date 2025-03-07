from pydantic import BaseModel, Field # Data validation library
from bson import ObjectId # MongoDB object ID
from datetime import datetime, timezone, timedelta # Date library

class Metrics(BaseModel):
    accuracy: float = 0.0
    f1_score: float = 0.0
    loss: float = 0.0
    precision: float = 0.0
    recall: float = 0.0

class ClientMetrics(BaseModel):
    client_id: str
    metrics: Metrics

# Each training round contains a unique ID, round ID, creation date, and a list of clients, and each client has a unique ID and metrics within the round.
class TrainingRound(BaseModel):
    round_id: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=3))  # AST (UTC+3) Current date and time
    clients: list[ClientMetrics] # List of client metrics

    # Pydantic configuration
    class Config:
        json_encoders = {
            ObjectId: str,  # Convert ObjectId to string
            datetime: lambda v: v.isoformat()  # Convert datetime to ISO format string
        }
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "examples": [
                {
                    "_id": {
                        "$oid": "67c74d550cacb1f9444af5a6"
                    },
                    "round_id": 1,
                    "created_at": "2025-03-04T18:58:29.947912",
                    "clients": [
                        {
                        "client_id": "client_1",
                        "metrics": {
                            "accuracy": 0.85,
                            "f1_score": 0.83,
                            "loss": 0.15,
                            "precision": 0.82,
                            "recall": 0.84
                        }
                        },
                        {
                        "client_id": "client_2",
                        "metrics": {
                            "accuracy": 0.88,
                            "f1_score": 0.86,
                            "loss": 0.12,
                            "precision": 0.85,
                            "recall": 0.87
                        }
                        },
                        {
                        "client_id": "client_3",
                        "metrics": {
                            "accuracy": 0.9,
                            "f1_score": 0.89,
                            "loss": 0.1,
                            "precision": 0.88,
                            "recall": 0.89
                        }
                        },
                        {
                        "client_id": "client_4",
                        "metrics": {
                            "accuracy": 0.87,
                            "f1_score": 0.85,
                            "loss": 0.13,
                            "precision": 0.86,
                            "recall": 0.85
                        }
                        }
                    ]
                }
            ]
        }