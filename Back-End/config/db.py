from motor.motor_asyncio import AsyncIOMotorClient  # Asynchronous operations for MongoDB (FastAPI is asynchronous)
import os

class MongoDB:
    def __init__(self):
        self.client = None  # Initialize client to None
        self.db = None  # Initialize db to None

mongodb = MongoDB()

async def connect_to_mongo():
    mongo_uri = os.getenv("MONGODB_URL", "mongodb://mongo:HiwDMYxRRpgqkefLILYZynRVwRWqImpy@mongodb.railway.internal:27017")
    db_name = os.getenv("DB_NAME", "fl_all")
    
    mongodb.client = AsyncIOMotorClient(mongo_uri)
    mongodb.db = mongodb.client[db_name]
    
async def close_mongo_connection():
    if mongodb.client:
        mongodb.client.close()
        
COLLECTION_NAME = "training_rounds"

async def insert_training_round(training_round):
    await mongodb.db[COLLECTION_NAME].insert_one(training_round)

async def get_training_rounds():
    return await mongodb.db[COLLECTION_NAME].find().to_list(100)

async def update_training_round(round_id, update_data):
    await mongodb.db[COLLECTION_NAME].update_one({"round_id": round_id}, {"$set": update_data})

async def delete_training_round(round_id):
    await mongodb.db[COLLECTION_NAME].delete_one({"round_id": round_id})