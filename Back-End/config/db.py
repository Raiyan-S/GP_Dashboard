from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class MongoDB:
    def __init__(self):
        self.client = None  # Initialize client to None
        self.db = None  # Initialize db to None

mongodb = MongoDB()
mongo_uri = os.getenv("MONGO_PUBLIC_URL")
db_name = os.getenv("DB_NAME")

mongodb.client = AsyncIOMotorClient(mongo_uri)
mongodb.db = mongodb.client[db_name]
async def open_connection():
    mongo_uri = os.getenv("MONGO_PUBLIC_URL")
    db_name = os.getenv("DB_NAME")

    mongodb.client = AsyncIOMotorClient(mongo_uri)
    mongodb.db = mongodb.client[db_name]
    
async def close_connection():
    if mongodb.client:
        mongodb.client.close()

db = mongodb.db