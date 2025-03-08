from fastapi import APIRouter, HTTPException, status # APIRouter to group routes, HTTPException to handle exceptions, status for HTTP status codes
from models.TrainingRound import TrainingRound
from config.db import mongodb
from bson import ObjectId
from fastapi.encoders import jsonable_encoder # Convert Pydantic models to dictionaries (because of complex types e.g., datetime)


router = APIRouter()

@router.get("/get", response_model=list[TrainingRound])
async def get_rounds():
    try:
        rounds = await mongodb.db['training_rounds'].find({}, {"_id": 0}).to_list(100)
        return jsonable_encoder(rounds)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/post", response_model=list[TrainingRound])
async def post_round(rounds: list[TrainingRound]):
    try:
        rounds_dict = jsonable_encoder(rounds) # This will recursively convert nested models
        result = await mongodb.db['training_rounds'].insert_many(rounds_dict)  
        for i, inserted_id in enumerate(result.inserted_ids):
            rounds_dict[i]["_id"] = str(inserted_id)
        return rounds_dict
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/clients", response_model=list[str])
async def get_unique_client_ids():
    try:
        pipeline = [
            {"$unwind": "$clients"},
            {"$group": {"_id": "$clients.client_id"}},
            {"$sort": {"_id": 1}}  # Sort the client IDs in ascending order
        ]
        result = await mongodb.db['training_rounds'].aggregate(pipeline).to_list(1000)
        client_ids = [doc["_id"] for doc in result]
        return client_ids
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/rounds/{client_id}", response_model=list[dict])
async def get_client_rounds(client_id: str):
    try:
        pipeline = [
            {"$unwind": "$clients"},  # Flatten the clients array
            {"$match": {"clients.client_id": client_id}},  # Filter for the specific client
            {
                "$project": {  # Include only the round_id and the client's metrics
                    "round_id": 1,
                    "metrics": "$clients.metrics",  # Rename 'clients.metrics' to 'metrics'
                    "created_at": 1,
                    "_id": 0  # Exclude the _id field
                }
            }
        ]
        rounds = await mongodb.db['training_rounds'].aggregate(pipeline).to_list(1000)
        # Map the data to the required format, simplifying the structure
        simplified_rounds = [
            {
                "round_id": round["round_id"],
                "metrics": round["metrics"],
                "created_at": round.get("created_at")
            }
            for round in rounds
        ]
        return simplified_rounds
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/latest-rounds", response_model=list[dict]) # just for debugging
async def get_latest_rounds():
    try:
        pipeline = [
            {"$unwind": "$clients"},  # Flatten clients array
            {"$sort": {"created_at": -1}},  # Sort by newest round first
            {
                "$group": {
                    "_id": "$clients.client_id",  # Group by client_id
                    "latest_round": {"$first": "$$ROOT"}  # Get the first (latest because we sorted by newest round) round
                }
            },
            {
                "$project": {
                    "_id": 0,  # Remove MongoDB _id field
                    "client_id": "$_id",
                    "round_id": "$latest_round.round_id",
                    "metrics": "$latest_round.clients.metrics",
                    "created_at": "$latest_round.created_at"
                }
            }
        ]
        
        latest_rounds = await mongodb.db["training_rounds"].aggregate(pipeline).to_list(1000)
        return latest_rounds
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/latest-rounds/averaged", response_model=dict)
async def get_averaged_metrics():
    try:
        pipeline = [
            {"$unwind": "$clients"},  # Flatten clients array
            {"$sort": {"created_at": -1}},  # Sort rounds by newest first
            {
                "$group": {
                    "_id": "$clients.client_id",  # Group by client_id
                    "latest_round": {"$first": "$$ROOT"}  # Get the first (latest) round per client
                }
            },
            {
                "$project": {
                    "_id": 0,  # Remove MongoDB _id field
                    "client_id": "$_id", 
                    "metrics": "$latest_round.clients.metrics"
                }
            }
        ]
        
        latest_rounds = await mongodb.db["training_rounds"].aggregate(pipeline).to_list(1000)

        # Aggregate metrics across all latest rounds
        total_metrics = {}
        client_count = len(latest_rounds)

        for round in latest_rounds:
            metrics = round["metrics"]
            for key, value in metrics.items():
                total_metrics[key] = total_metrics.get(key, 0) + value  # Sum up metric values

        if client_count > 0:
            averaged_metrics = {key: round(value / client_count,4) for key, value in total_metrics.items()}  # Compute averages

        return {"averaged_metrics": averaged_metrics, "client_count": client_count}
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    
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