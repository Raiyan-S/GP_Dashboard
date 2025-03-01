from fastapi import APIRouter, HTTPException # APIRouter to group routes, HTTPException to handle exceptions
from models.TrainingRound import TrainingRound
from config.db import mongodb
from bson import ObjectId

router = APIRouter()

@router.get("/")
async def get_rounds():
    return mongodb.db['training_rounds'].find()

@router.post("/", response_model=TrainingRound)
async def post_round(round: TrainingRound):
    # Convert pydantic to dictionary
    round_dict = round.model_dump()  # This will recursively convert nested models
    await mongodb.db['training_rounds'].insert_one(round_dict)
    return round

# chatgpt generated (need to connect to mongodb to check)
'''
# Service Functions
async def fetch_rounds(filter: dict = None): # Fetch rounds from MongoDB (if filter is None, fetch all rounds)
    try:
        query = filter if filter else {}
        rounds = await mongodb.db['training_rounds'].find(query).sort("created_at", -1)
        return rounds
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def fetch_aggregated_stats(): # Fetch aggregated stats (for summary average in dashboard)
    try:
        stats = await mongodb.db['training_rounds'].aggregate([
            {"$unwind": "$clients"},
            {
                "$group": {
                    "_id": None,
                    "totalRounds": {"$addToSet": "$round_id"},
                    "avgAccuracy": {"$avg": "$clients.metrics.accuracy"},
                    "avgF1Score": {"$avg": "$clients.metrics.f1_score"},
                    "avgLoss": {"$avg": "$clients.metrics.loss"}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "totalRounds": {"$size": "$totalRounds"},
                    "avgAccuracy": 1,
                    "avgF1Score": 1,
                    "avgLoss": 1
                }
            }
        ]).to_list(1)
        
        if not stats:
            return {
                "totalRounds": 0,
                "avgAccuracy": 0,
                "avgF1Score": 0,
                "avgLoss": 0
            }
        
        return {
            "totalRounds": stats[0]['totalRounds'],
            "avgAccuracy": stats[0]['avgAccuracy'] * 100,
            "avgF1Score": stats[0]['avgF1Score'] * 100,
            "avgLoss": stats[0]['avgLoss']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoints
@router.get("/", response_model = list[TrainingRound]) 
async def get_all_rounds_endpoint(client_id: str = None):
    filter = {"clients.client_id": client_id} if client_id else {}
    rounds = await fetch_rounds(filter)
    transformed_data = []
    for round in rounds:
        client_data = next((c for c in round['clients'] if c['client_id'] == client_id), round['clients'][0])
        transformed_data.append({
            "round": round['round_id'],
            "timestamp": round['created_at'],
            "accuracy": client_data['metrics']['accuracy'] * 100,
            "f1Score": client_data['metrics']['f1_score'] * 100,
            "loss": client_data['metrics']['loss'],
            "precision": client_data['metrics']['precision'],
            "recall": client_data['metrics']['recall']
        })
    return transformed_data

@router.get("/stats") 
async def get_performance_stats_endpoint():
    return await fetch_aggregated_stats()

@router.get("/round/{round_id}", response_model=TrainingRound)
async def get_round_by_id_endpoint(round_id: str):
    rounds = await fetch_rounds({"round_id": round_id})
    if not rounds:
        raise HTTPException(status_code=404, detail="Round not found")
    return rounds[0]
'''