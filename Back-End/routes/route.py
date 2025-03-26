from fastapi import APIRouter, HTTPException, status # APIRouter to group routes, HTTPException to handle exceptions, status for HTTP status codes
from models.TrainingRound import TrainingRound
from config.db import db
from fastapi.encoders import jsonable_encoder # Convert Pydantic models to dictionaries (because of complex types e.g., datetime)

router = APIRouter()

# get all rounds
@router.get("/get", response_model=list[TrainingRound])
async def get_rounds():
    try:
        rounds = await db['training_rounds'].find({}, {"_id": 0}).to_list(100)
        return jsonable_encoder(rounds)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# post rounds
@router.post("/post", response_model=list[TrainingRound])
async def post_round(rounds: list[TrainingRound]):
    try:
        rounds_dict = jsonable_encoder(rounds)  # This will recursively convert nested models

        # Insert the rounds data into the database (insert_many for multiple records)
        result = await db['Rounds'].insert_many(rounds_dict)
        
        # Add the inserted IDs to each round
        for i, inserted_id in enumerate(result.inserted_ids):
            rounds_dict[i]["_id"] = str(inserted_id)
        return rounds_dict
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# @router.get("/clients", response_model=list[str])
# async def get_unique_client_ids():
#     try:
#         # First, get the clients from the aggregation pipeline
#         pipeline = [
#             {"$project": {"clients": {"$objectToArray": "$clients"}}},
#             {"$unwind": "$clients"},
#             {"$group": {"_id": "$clients.k"}},
#             {"$sort": {"_id": 1}}
#         ]
        
#         # Execute the aggregation pipeline
#         result = await db['test2'].aggregate(pipeline).to_list(1000)
        
#         # Get the client IDs from the aggregation result
#         client_ids = [doc["_id"] for doc in result]
        
#         # Add "Global" to the list of client IDs
#         client_ids.append("Global")
        
#         return client_ids
    
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# @router.get("/rounds/{client_id}", response_model=list[dict])
# async def get_client_rounds(client_id: str):
#     try:
#         pipeline = [
#             {"$project": {
#                 "round": 1,  # Include the round field
#                 "clients": 1,  # Include the clients field for each round
#                 "Global": 1  # Include the Global metrics for each round
#             }},
#             {"$unwind": "$clients"},  # Flatten the clients inside each round
#             {
#                 "$match": {  # Match either the specific client or the global metrics
#                     "$or": [
#                         {f"clients.{client_id}": {"$exists": True}},  # Client-specific match
#                         {"Global": {"$exists": True}}  # Global match
#                     ]
#                 }
#             },
#             {"$sort": {"round": 1}},  # Sort by round number
#             {
#                 "$project": {  # Select relevant fields for the output
#                     "round_id": "$round",  # Include the round ID
#                     "clients": {  # Only include the client metrics for the specific client
#                         "$ifNull": [f"$clients.{client_id}", None]  # Return client metrics if present
#                     },
#                     "Global": 1,  # Include Global metrics if present
#                     "_id": 0  # Exclude the _id field
#                 }
#             }
#         ]
        
#         # Debugging: Check the aggregation results
#         rounds = await db['test2'].aggregate(pipeline).to_list(1000)
#         print(f"Found {len(rounds)} rounds matching the query")

#         # Simplify the rounds structure to return the necessary data
#         simplified_rounds = [
#             {
#                 "round_id": round["round_id"],
#                 "client_metrics": round["clients"],  # Specific client metrics
#                 "Global": round["Global"],  # Global metrics
#             }
#             for round in rounds if round["clients"] or round["Global"]
#         ]
#         return simplified_rounds
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get all unique client IDs
@router.get("/client", response_model=list[str])
async def get_unique_client_ids():
    try:
        # Fetch a single document to get the client field names and check for "Global"
        first_doc = await db['test4'].find_one()

        # Get the client field names dynamically (keys of the document excluding _id and other fields)
        client_fields = [key for key in first_doc.keys() if key.startswith('client_')]

        # Check if "Global" field exists and add it if it does
        if "Global" in first_doc:
            client_fields.append("Global")

        # # Build the aggregation pipeline dynamically using the client fields and "Global"
        # pipeline = [
        #     {"$project": {
        #         "client_ids": client_fields  # Use the dynamic client fields including "Global"
        #     }},
        #     {"$unwind": "$client_ids"},  # Unwind to get each client and Global as separate documents
        #     {"$group": {"_id": "$client_ids"}},  # Group by field names (client_0, client_1, etc., and "Global")
        #     {"$sort": {"_id": 1}}  # Sort the client IDs and Global in ascending order
        # ]

        # result = await db['test4'].aggregate(pipeline).to_list(1000)
        # client_ids = [doc["_id"] for doc in result]
        
        return client_fields
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# get all rounds for a specific client
@router.get("/rounds/{client_id}", response_model=list[dict])
async def get_client_rounds(client_id: str):
    try:
        # Aggregate pipeline to retrieve all rounds and check if the client exists
        pipeline = [
            # Match documents where the client_id/Global field exists
            {"$match": {f"{client_id}": {"$exists": True}}},
            # Project the fields 
            {"$project": {
                "round": 1,  # Include the round field
                "created_at": 1,  # Include the created_at field
                f"metrics": f"${client_id}",  # Directly access the client_id as a field
            }},

            # Sort by round number
            {"$sort": {"round": 1}}
        ]

        # Execute the aggregation pipeline
        rounds = await db['test4'].aggregate(pipeline).to_list(1000)

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