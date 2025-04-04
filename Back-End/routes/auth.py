from fastapi import Depends, HTTPException, Response, Request, APIRouter, Form 
from pydantic import EmailStr
from passlib.context import CryptContext # Password hashing library
from datetime import datetime, timedelta, timezone
import secrets # For generating secure tokens
import logging
from config.db import mongodb # MongoDB connection
from rateLimiter import limiter # Rate limiter

router = APIRouter() # Groups all routes in this file into a single router with a prefix /api/auth

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

# Dependency to get the Users collection from MongoDB
def get_users_collection():
    return mongodb.db["Users"]

# Dependency to get the Sessions collection from MongoDB
def get_sessions_collection():
    return mongodb.db["Sessions"]

# Password Validation (Over 8 characters, at least one letter and one digit)
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

# Generate secure session token
# It looks like this: 49bf7be3593ce9da969d87adf9f8d4a9946405ba08c1fb498a0af39fda602245
def generate_session_token():
    return secrets.token_hex(32)

# Create session in MongoDB
async def create_session(user_id: str):
    sessions_collection = get_sessions_collection() 
    session_token = generate_session_token() 
    expiry_time = datetime.now(timezone.utc) + timedelta(hours=1) # Session expires in 1 hour

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
        if expiry_time < datetime.now(timezone.utc): # Check if session is expired
            await sessions_collection.delete_one({"token": token}) # Remove expired session
            logger.info(f"Session with token {token} has expired and was removed.")
            return None  # Session expired

        return session # Session is valid
    return None

# Authentication Middleware
async def get_current_user(request: Request):
    users_collection = get_users_collection()
    token = request.cookies.get("session_token") # Get session token from cookies
    if not token: # If no token is found, raise an exception
        raise HTTPException(status_code=401, detail="Unauthorized")

    session = await get_session(token) # Get session from MongoDB
    if not session: # If session is not found or expired, raise an exception
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    user = await users_collection.find_one({"_id": session["user_id"]}) # Get user from MongoDB using session user_id
    if not user: # If user is not found, raise an exception (this happens if the user was deleted)
        raise HTTPException(status_code=401, detail="User not found.")
    
    return user

# Get current active user (for protected routes and api calls)
# This function checks if the user is authenticated and has the required role to access the route
async def get_current_active_user(current_user= Depends(get_current_user)):
    if current_user["role"] not in ["admin", "clinic"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# User Registration
@router.post("/register")
@limiter.limit("20/minute")
async def register_user(request: Request, username: EmailStr = Form(...), password: PasswordStr = Form(...)):
    users_collection = get_users_collection()
    
    # Check if email already exists
    existing_user = await users_collection.find_one({"username": username})
    if existing_user: # If user already exists, raise an exception
        logger.warning(f"Registration failed: Email {username} is already registered.")
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password and store the user in MongoDB
    hashed_password = pwd_context.hash(password)
    user = {
        "username": username,
        "password": hashed_password,
        "role": "clinic",  # Default role is clinic
        "created_at": datetime.now(timezone.utc)  # Timestamp for user creation
    }
    await users_collection.insert_one(user)
    logger.info(f"User registered successfully: {username}")
    return {"message": "User registered successfully"}

# Login & Create Session
@router.post("/login")
@limiter.limit("20/minute")
async def login(request: Request, response: Response, username: str = Form(...), password: str = Form(...)):
    users_collection = get_users_collection()
    sessions_collection = get_sessions_collection()
    
    # Check if user exists
    user = await users_collection.find_one({"username": username})
    if not user or not pwd_context.verify(password, user["password"]):
        logger.warning(f"Failed login attempt for username: {username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    logger.info(f"User {username} logged in successfully")
    
    # Return the role of the user
    role = user.get("role")
    
    # Remove the previous session of the user if it exists
    await sessions_collection.delete_many({"user_id": user["_id"]})
    # Create a new session for the user
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
    
    token = request.cookies.get("session_token") # Get session token from cookies
    if token: # If token is found, remove the session from MongoDB 
        session = await sessions_collection.find_one({"token": token})
        logger.info(f"User with ID {session['user_id']} logged out successfully.")
        await sessions_collection.delete_one({"token": token})

    # Remove the session token cookie from the response
    # This will delete the cookie from the client side
    response.delete_cookie("session_token")
    return {"message": "Logged out"}

# Verify Token and Get User Role
@router.get("/verify-token")
@limiter.limit("30/minute")
async def verify_token(request: Request, user=Depends(get_current_user)):
    return {"message": "Session is valid.", "username": user["username"],"role": user["role"]}

# Protected Routes
# Only accessible to authenticated users with the correct role
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