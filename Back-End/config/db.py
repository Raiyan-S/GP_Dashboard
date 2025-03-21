from motor.motor_asyncio import AsyncIOMotorClient  # Asynchronous operations for MongoDB (FastAPI is asynchronous)
import os
from dotenv import load_dotenv
from beanie import Document
from fastapi_users_db_beanie import BeanieBaseUser, BeanieUserDatabase
from fastapi_users_db_beanie.access_token import (
    BeanieAccessTokenDatabase,
    BeanieBaseAccessToken
)

load_dotenv()  # Load environment variables from .env file

DATABASE_URL = os.getenv("MONGO_PUBLIC_URL")
DB_NAME = os.getenv("DB_NAME")
client = AsyncIOMotorClient(DATABASE_URL)
db = client[DB_NAME]


class User(BeanieBaseUser, Document):
    pass


class AccessToken(BeanieBaseAccessToken, Document):  
    pass


async def get_user_db():
    yield BeanieUserDatabase(User)


async def get_access_token_db():  
    yield BeanieAccessTokenDatabase(AccessToken)
