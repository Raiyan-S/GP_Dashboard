from fastapi import APIRouter, HTTPException, status # APIRouter to group routes, HTTPException to handle exceptions, status for HTTP status codes
from models.TrainingRound import TrainingRound
from config.db import db
from fastapi.encoders import jsonable_encoder # Convert Pydantic models to dictionaries (because of complex types e.g., datetime)

router = APIRouter()

# get all rounds
@router.get("/get", response_model=list[TrainingRound])
async def get_rounds():
    try:
        rounds = await db['Rounds'].find({}, {"_id": 0}).to_list(None)
        return jsonable_encoder(rounds)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# post a single round
@router.post("/post", response_model=list[TrainingRound])
async def post_round(round: list[TrainingRound]):
    try:
        rounds_dict = jsonable_encoder(round)  
        await db['Rounds'].drop()
        
        # Insert the rounds data into the database (insert_many for multiple records)
        result = await db['Rounds'].insert_many(rounds_dict)
        
        # Add the inserted IDs to each round
        for i, inserted_id in enumerate(result.inserted_ids):
            rounds_dict[i]["_id"] = str(inserted_id)
        return rounds_dict
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get all unique client IDs
@router.get("/client", response_model=list[str])
async def get_unique_client_ids():
    try:
        # Fetch a single document to get the client field names and check for "Global"
        first_doc = await db['Rounds'].find_one()

        # Get the client field names dynamically (keys of the document excluding _id and other fields)
        client_fields = [key for key in first_doc.keys() if key.startswith('client_') or key.startswith('Global')]
        
        return client_fields
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get all rounds for a specific client
@router.get("/rounds/{client_id}", response_model=list[dict])
async def get_client_rounds(client_id: str, order: str = "desc"):
    try:
        # Determine the sort order based on the query parameter
        sort_order = -1 if order == "desc" else 1

        # Aggregate pipeline to retrieve all rounds of a specific client
        pipeline = [
            # Match documents where the client_id field matches the provided client_id
            {"$match": {f"{client_id}": {"$exists": True}}}, # Match documents with the client_id field
            {
                "$addFields": {
                    "round_as_number": {"$toInt": "$round"}  # Convert the round field to an integer
                }
            },
            {
                "$project": {
                    "_id": 0,  # Exclude the MongoDB _id field
                    "round": "$round",  
                    "created_at": "$created_at",  
                    "metrics": f"${client_id}",
                    "round_as_number": 1  # Include the converted round_as_number field for sorting
                }
             },
             {"$sort": {"round_as_number": sort_order}},  # Sort by round number in the specified order
        ]

        # Execute the aggregation pipeline
        rounds = await db['Rounds'].aggregate(pipeline).to_list(None)

        # Simplify the response format
        simplified_rounds = [
            {
                "round_id": round["round"],
                "metrics": round.get("metrics"),  
                "created_at": round.get("created_at"),
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
        
        latest_rounds = await db["training_rounds"].aggregate(pipeline).to_list(None)
        return latest_rounds
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/best-f1-global", response_model=dict)
async def get_best_f1_global():
    try:
        pipeline = [
            {"$match": {"Global": {"$exists": True}}},  # Ensure "Global" field exists
            {
                "$project": {
                    "_id": 0,  # Exclude MongoDB _id field
                    "round": 1,
                    "created_at": 1,
                    "metrics": "$Global",  # Extract the entire "Global" object
                    "f1": "$Global.f1"  # Extract only the F1 score
                }
            },
            {"$sort": {"f1": -1}},  # Sort by F1 score in descending order
            {"$limit": 1}  # Keep only the document with the highest Global F1
        ]

        best_f1_global = await db["Rounds"].aggregate(pipeline).to_list(1) # Get the best F1 score

        return best_f1_global[0]
    
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