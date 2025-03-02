from pydantic import BaseModel, Field # Data validation library
from bson import ObjectId # MongoDB object ID
from datetime import datetime # Date library
from typing import List

'''
# Handle MongoDB object ID to ensure every ID is unique
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid ObjectId')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")
'''
# # Helper function to handle ObjectId as a string
# def generate_object_id():
#     return str(ObjectId())

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
    # id: PyObjectId = Field(default_factory=PyObjectId, alias='_id') 
    # id: str = Field(default_factory=generate_object_id, alias='_id') # Generate unique ID
    round_id: str
    created_at: datetime = Field(default_factory=datetime.now) # Current date and time
    clients: List[ClientMetrics] # List of client metrics
    id: str = Field(default_factory=lambda: str(ObjectId()), alias='_id')

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
                    "_id": "65b9df75f39c4f6c9a6b4e51",
                    "round_id": "1",
                    "created_at": "2024-02-26T12:00:00Z",
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
                        }
                    ]
                }
            ]
        }