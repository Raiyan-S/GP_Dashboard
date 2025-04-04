from motor.motor_asyncio import AsyncIOMotorClient # Asynchronous MongoDB client
import os
from dotenv import load_dotenv # For loading environment variables from .env file

load_dotenv()  # Load environment variables from .env file

# Class for MongoDB connection
class MongoDB:
    def __init__(self):
        self.client = None  # Initialize client to None
        self._db = None  # Initialize db to None

    @property
    def db(self):
        if self._db is None:
            raise RuntimeError("Database connection has not been initialized.")
        return self._db

    def set_db(self, db):
        self._db = db

# Initialize MongoDB instance
mongodb = MongoDB()

# Function to open a connection to the MongoDB database
async def open_connection():
    mongo_uri = os.getenv("MONGO_PUBLIC_URL")
    db_name = os.getenv("DB_NAME")

    mongodb.client = AsyncIOMotorClient(mongo_uri)
    mongodb.set_db(mongodb.client[db_name]) 

# Function to close the connection to the MongoDB database
async def close_connection():
    if mongodb.client:
        mongodb.client.close()