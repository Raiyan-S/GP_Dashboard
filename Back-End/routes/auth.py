from fastapi import Depends, HTTPException, Response, Request, APIRouter, Form
from pydantic import EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import secrets
import logging
from config.db import mongodb
from rateLimiter import limiter

router = APIRouter()

# Configure logging for railway
# This will log to stdout, which is captured by Railway and displayed in the logs
logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",  # Log format
    handlers=[
        logging.StreamHandler() 
    ]
)

logger = logging.getLogger("app")

# Dependency to get the Users collection
def get_users_collection():
    return mongodb.db["Users"]

# Dependency to get the Sessions collection
def get_sessions_collection():
    return mongodb.db["Sessions"]

# Password Validation
class PasswordStr(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value, field=None, config=None):
        if len(value) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
        if not any(char.isdigit() for char in value):
            raise HTTPException(status_code=400, detail="Password must contain at least one digit")
        if not any(char.isalpha() for char in value):
            raise HTTPException( status_code=400, detail="Password must contain at least one letter")
        return value
    
# Password Hashing
# Recommended by OWASP and defaults to argon2id
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Session settings
SESSION_EXPIRY = timedelta(hours=1)
SESSION_REFRESH_THRESHOLD = timedelta(minutes=15)  # Extend session if used in last 15 mins

# Generate secure session token
# It looks like this: 49bf7be3593ce9da969d87adf9f8d4a9946405ba08c1fb498a0af39fda602245
def generate_session_token():
    return secrets.token_hex(32)

# Create session in MongoDB
async def create_session(user_id: str):
    sessions_collection = get_sessions_collection()
    session_token = generate_session_token()
    expiry_time = datetime.now(timezone.utc) + SESSION_EXPIRY

    # Store session in MongoDB
    await sessions_collection.insert_one({"user_id": user_id, "token": session_token, "expires": expiry_time})

    return session_token

# Get session from MongoDB by token
async def get_session(token: str):
    sessions_collection = get_sessions_collection()
    session = await sessions_collection.find_one({"token": token})
    if session:
        expiry_time = session["expires"]
        expiry_time = expiry_time.replace(tzinfo=timezone.utc)
        if expiry_time < datetime.now(timezone.utc):
            await sessions_collection.delete_one({"token": token}) # Check if session is expired
            return None  # Session expired

        # Refresh session expiry if within threshold so user can stay logged in as long as they are active
        if expiry_time - datetime.now(timezone.utc) < SESSION_REFRESH_THRESHOLD: # if expiry time is within threshold, refresh expiry
            new_expiry = datetime.now(timezone.utc) + SESSION_EXPIRY
            await sessions_collection.update_one({"token": token}, {"$set": {"expires": new_expiry}})
            
        return session # Session is valid
    return None

# Authentication Middleware
async def get_current_user(request: Request):
    users_collection = get_users_collection()
    token = request.cookies.get("session_token")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    session = await get_session(token)
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    user = await users_collection.find_one({"_id": session["user_id"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    
    return user

async def get_current_active_user(current_user= Depends(get_current_user)):
    if current_user["role"] not in ["admin", "client"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# User Registration
@router.post("/register")
@limiter.limit("20/minute")
async def register_user(request: Request, username: EmailStr = Form(...), password: PasswordStr = Form(...)):
    users_collection = get_users_collection()
    # Check if email already exists
    existing_user = await users_collection.find_one({"username": username})
    if existing_user:
        logger.warning(f"Registration failed: Email {username} is already registered.")
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(password)
    user = {"username": username, "password": hashed_password, "role": "clinic"}  # Default role is clinic
    await users_collection.insert_one(user)
    logger.info(f"User registered successfully: {username}")
    return {"message": "User registered successfully"}

# Login & Create Session
@router.post("/login")
@limiter.limit("20/minute")
async def login(request: Request, response: Response, username: str = Form(...), password: str = Form(...)):
    users_collection = get_users_collection()
    sessions_collection = get_sessions_collection()
    user = await users_collection.find_one({"username": username})
    if not user or not pwd_context.verify(password, user["password"]):
        logger.warning(f"Failed login attempt for username: {username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    logger.info(f"User {username} logged in successfully")
    
    # Return the role of the user
    role = user.get("role")
    
    # Remove the previous session of the user if it exists
    await sessions_collection.delete_many({"user_id": user["_id"]})
    session_token = await create_session(user["_id"])
    
    # Set Secure HTTP-only Cookie with session token for the duration of the session
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    return {"message": "Login successful", "role": role}

# Logout (Remove session)
@router.post("/logout")
@limiter.limit("20/minute")
async def logout(response: Response, request: Request):
    sessions_collection = get_sessions_collection()
    token = request.cookies.get("session_token")
    if token:
        session = await sessions_collection.find_one({"token": token})
        logger.info(f"User with ID {session['user_id']} logged out successfully.")
        await sessions_collection.delete_one({"token": token})

    response.delete_cookie("session_token")
    return {"message": "Logged out"}

# Verify Token and Get User Role
@router.get("/verify-token")
@limiter.limit("30/minute")
async def verify_token(request: Request, user=Depends(get_current_user)):
    return {"message": "Session is valid.", "username": user["username"],"role": user["role"]}

# Protected Routes
# Only accessible to authenticated users
@router.get("/dashboard", dependencies=[Depends(get_current_active_user)])
async def read_dashboard(current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return {"message": "Welcome to the dashboard"}

@router.get("/clients", dependencies=[Depends(get_current_active_user)])
async def read_clients(current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return {"message": "Welcome to the clients page"}

@router.get("/model-trial", dependencies=[Depends(get_current_active_user)])
async def read_model_trial(current_user = Depends(get_current_user)):
    if current_user["role"] != "clinic" or current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return {"message": "Welcome to the model trial page"}