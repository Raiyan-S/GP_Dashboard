from fastapi import APIRouter, HTTPException, status # APIRouter to group routes, HTTPException to handle exceptions, status for HTTP status codes
from models.TrainingRound import TrainingRound
from config.db import db
from fastapi.encoders import jsonable_encoder # Convert Pydantic models to dictionaries (because of complex types e.g., datetime)
import numpy as np


router = APIRouter()

# get all rounds
@router.get("/get", response_model=list[TrainingRound])
async def get_rounds():
    try:
        rounds = await db['training_rounds'].find({}, {"_id": 0}).to_list(100)
        return jsonable_encoder(rounds)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# post a round or rounds
@router.post("/post", response_model=list[TrainingRound])
async def post_round(rounds: list[TrainingRound]):
    try:
        # Convert confusion_matrix arrays to lists before sending to the database
        rounds_dict = jsonable_encoder(rounds)  # This will recursively convert nested models
        
        for round_data in rounds_dict:
            for client_id, client_metrics in round_data['clients'].items():
                if client_metrics['metrics']:
                    # Convert confusion_matrix arrays to lists
                    if isinstance(client_metrics['metrics'].get('confusion_matrix'), np.ndarray):
                        client_metrics['metrics']['confusion_matrix'] = client_metrics['metrics']['confusion_matrix'].tolist()
                    if isinstance(client_metrics['metrics'].get('per_class_accuracy'), dict):
                        # Ensure per_class_accuracy is a dict (might need to process it further if it's a complex type)
                        client_metrics['metrics']['per_class_accuracy'] = dict(client_metrics['metrics']['per_class_accuracy'])

        # Insert the rounds data into the database
        result = await db['test1'].insert_many(rounds_dict)
        for i, inserted_id in enumerate(result.inserted_ids):
            rounds_dict[i]["_id"] = str(inserted_id)
        return rounds_dict
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get all unique client IDs
@router.get("/clients", response_model=list[str])
async def get_unique_client_ids():
    try:
        pipeline = [
            {"$unwind": "$clients"},
            {"$group": {"_id": "$clients.client_id"}},
            {"$sort": {"_id": 1}}  # Sort the client IDs in ascending order
        ]
        result = await db['training_rounds'].aggregate(pipeline).to_list(1000)
        client_ids = [doc["_id"] for doc in result]
        return client_ids
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get all rounds for a specific client
@router.get("/rounds/{client_id}", response_model=list[dict])
async def get_client_rounds(client_id: str):
    try:
        pipeline = [
            {"$unwind": "$clients"},  # Flatten the clients array
            {"$match": {"clients.client_id": client_id}},  # Filter for the specific client
            {"$sort": {"_id": 1}},  # Sort by created_at in ascending order
            {
                "$project": {  # Include only the round_id and the client's metrics
                    "round_id": 1,
                    "metrics": "$clients.metrics",  # Rename 'clients.metrics' to 'metrics'
                    "created_at": 1,
                    "_id": 0  # Exclude the _id field
                }
            }
        ]
        rounds = await db['training_rounds'].aggregate(pipeline).to_list(1000)
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

# get the latest round for each client (probably will remove)
@router.get("/latest-rounds", response_model=list[dict]) # just for debugging
async def get_latest_rounds():
    try:
        pipeline = [
            {"$unwind": "$clients"},  # Flatten clients array
            {"$sort": {"_id": -1}},  # Sort by newest round first
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
        
        latest_rounds = await db["training_rounds"].aggregate(pipeline).to_list(1000)
        return latest_rounds
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get the latest round for each client then average the metrics
@router.get("/latest-rounds/averaged", response_model=dict)
async def get_averaged_metrics():
    try:
        pipeline = [
            {"$unwind": "$clients"},  # Flatten clients array
            {"$sort": {"_id": -1}},  # Sort rounds by newest first
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
        
        latest_rounds = await db["training_rounds"].aggregate(pipeline).to_list(1000)

        # Aggregate metrics across all latest rounds
        total_metrics = {}
        client_count = len(latest_rounds)

        for round_data in latest_rounds:
            metrics = round_data["metrics"]
            for key, value in metrics.items():
                total_metrics[key] = total_metrics.get(key, 0) + value  # Sum up metric values

        # Compute averages and round the results at the end
        if client_count > 0:
            averaged_metrics = {key: round(value / client_count, 3) for key, value in total_metrics.items()}  # Compute averages
        else:
            averaged_metrics = {}

        return {"averaged_metrics": averaged_metrics, "client_count": client_count}
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get the second latest round for each client then average the metrics (I think I'll need this for comparing the last round if it's up or down trending)
@router.get("/second-latest-rounds/averaged", response_model=dict) # need to check if there's a better way
async def get_second_last_averaged_metrics():
    try:
        pipeline = [
            {"$unwind": "$clients"},  # Flatten clients array
            {"$sort": {"_id": -1}},  # Sort rounds by newest first
            {
                "$group": {
                    "_id": "$clients.client_id",  # Group by client_id
                    "rounds": {"$push": "$$ROOT"}  # Push all rounds to an array
                }
            },
            {
                "$project": {
                    "_id": 0,  # Remove MongoDB _id field
                    "client_id": "$_id",
                    "second_latest_round": {"$arrayElemAt": ["$rounds", 1]}  # Get the second latest round
                }
            }
        ]
        
        second_latest_rounds = await db["training_rounds"].aggregate(pipeline).to_list(1000)

        # Aggregate metrics across all second latest rounds
        total_metrics = {}
        client_count = len(second_latest_rounds)

        for round_data in second_latest_rounds:
            metrics = round_data["second_latest_round"]["clients"]["metrics"]
            for key, value in metrics.items():
                total_metrics[key] = total_metrics.get(key, 0) + value  # Sum up metric values

        # Compute averages and round the results at the end
        if client_count > 0:
            averaged_metrics = {key: round(value / client_count, 3) for key, value in total_metrics.items()}  # Compute averages
        else:
            averaged_metrics = {}

        return {"averaged_metrics": averaged_metrics, "client_count": client_count}
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))