from pydantic import BaseModel, Field # Data validation library
from bson import ObjectId # MongoDB object ID
from datetime import datetime # Date library

# Need to fix localhost:8000/docs

# Handle MongoDB object ID to ensure every ID is unique
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")

class Metrics(BaseModel):
    accuracy: float
    f1_score: float
    loss: float
    precision: float
    recall: float

class ClientMetrics(BaseModel):
    client_id: str
    metrics: Metrics

# Each training round contains a unique ID, round ID, creation date, and a list of clients, and each client has a unique ID and metrics within the round.
class TrainingRound(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id') # Generate unique ID
    round_id: str
    created_at: datetime = Field(default_factory=datetime.now) # Current date and time
    clients: list[ClientMetrics] # List of client metrics

    # Pydantic configuration
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}