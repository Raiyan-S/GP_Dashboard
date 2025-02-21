from motor.motor_asyncio import AsyncIOMotorClient # Asynchronous operations for MongoDB (FastAPI is asynchronous)
import os

class MongoDB:
    client: AsyncIOMotorClient = None # None by default

mongodb = MongoDB()

async def connect_to_mongo():
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")  # Default URI
    db_name = os.getenv("MONGODB_DBNAME", "test_db")  # Default database name
    
    mongodb.client = AsyncIOMotorClient(mongo_uri)
    mongodb.db = mongodb.client[db_name]

async def close_mongo_connection():
    mongodb.client.close()