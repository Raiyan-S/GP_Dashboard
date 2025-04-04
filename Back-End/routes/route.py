from fastapi import APIRouter, HTTPException, status, Depends, Header # APIRouter to group routes, HTTPException to handle exceptions, status for HTTP status codes, Depends for dependency injection
from models.TrainingRound import TrainingRound # Pydantic model for TrainingRound
from config.db import mongodb # MongoDB connection
from fastapi.encoders import jsonable_encoder # Convert Pydantic models to dictionaries (because of complex types e.g., datetime)
from routes.auth import get_current_active_user  # Import the dependency for authentication
import os

router = APIRouter() # Groups all routes in this file into a single router with a prefix /api

# This endpoint retrieves all training rounds from the database
# It is mostly used for debugging
@router.get("/get", response_model=list[TrainingRound])
async def get_rounds(current_user: str = Depends(get_current_active_user)):
    try:
        # Ensure the user has the correct role or permissions
        if current_user["role"] != "admin":
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this resource"
            )
        
        rounds = await mongodb.db['Rounds'].find({}, {"_id": 0}).to_list(None)
        return rounds
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# This endpoint is to post a list of training rounds to the database
# It drops the existing collection and inserts the new rounds so that the database is always up to date
@router.post("/post", response_model=list[TrainingRound])
async def post_round(round: list[TrainingRound]):
    try:
        rounds_dict = jsonable_encoder(round)
        await mongodb.db['Rounds'].drop() # Drop the existing collection
        
        # Insert the rounds data into the database (insert_many for multiple records at once)
        result = await mongodb.db['Rounds'].insert_many(rounds_dict)
        
        # Add the inserted IDs to each round 
        # This is done to return the IDs of the inserted rounds
        for i, inserted_id in enumerate(result.inserted_ids):
            rounds_dict[i]["_id"] = str(inserted_id)
        return rounds_dict
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# This endpoint retrieves all unique client IDs from the database
# It dynamically fetches the client field names from the first document in the collection
@router.get("/client", response_model=list[str])
async def get_unique_client_ids(current_user: str = Depends(get_current_active_user)):
    try:
        # Ensure the user has the correct role or permissions
        if current_user["role"] != "admin":
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this resource"
            )
            
        # Fetch a single document from the collection
        first_doc = await mongodb.db['Rounds'].find_one()

        # Get the client field names and Global dynamically 
        client_fields = [key for key in first_doc.keys() if key.startswith('client_') or key.startswith('Global')]
        
        return client_fields
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# This endpoint retrieves all rounds for a specific client ID
# It allows sorting the results in ascending or descending order based on the round number
# Descending order for the tables and ascending order for the charts
@router.get("/rounds/{client_id}", response_model=list[dict])
async def get_client_rounds(client_id: str, order: str = "desc", current_user: str = Depends(get_current_active_user)):
    try:
        # Ensure the user has the correct role or permissions
        if current_user["role"] != "admin":
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this resource"
            )
            
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
                    "round": "$round",  # the round field is a string
                    "created_at": "$created_at",  
                    "metrics": f"${client_id}",
                    "round_as_number": 1  # Include the converted round_as_number field for sorting
                }
             },
             {"$sort": {"round_as_number": sort_order}},  # Sort by round number in the specified order
        ]

        # Execute the aggregation pipeline
        rounds = await mongodb.db['Rounds'].aggregate(pipeline).to_list(None)

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

# This endpoint retrieves the best F1 score for Global
# It uses an aggregation pipeline to find the round with the highest F1 score for the Global
@router.get("/best-f1-global", response_model=dict)
async def get_best_f1_global(current_user: str = Depends(get_current_active_user)):
    try:
        # Ensure the user has the correct role or permissions
        if current_user["role"] != "admin":
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this resource"
            )
            
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

        best_f1_global = await mongodb.db["Rounds"].aggregate(pipeline).to_list(1) # Get the best F1 score

        return best_f1_global[0]
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/posttest", response_model=list[TrainingRound])
async def post_round(round: list[TrainingRound], x_api_key: str = Header(...)):
    try:
        api_key = os.getenv("API_KEY")
        if x_api_key != api_key:
            raise HTTPException(status_code=401, detail="Invalid API key")
        
        # Insert the rounds data into the database (insert_many for multiple records at once)
        result = await mongodb.db['posttest'].insert_many(round)
        
        # Add the inserted IDs to each round 
        # This is done to return the IDs of the inserted rounds
        for i, inserted_id in enumerate(result.inserted_ids):
            round[i]["_id"] = str(inserted_id)
        return round
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))