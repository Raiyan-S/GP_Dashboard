from fastapi import Depends, HTTPException, Response, Request, APIRouter, Form
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import secrets
from config.db import db

router = APIRouter()

users_collection = db["Users"]
sessions_collection = db["Sessions"]

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
    session_token = generate_session_token()
    expiry_time = datetime.now(timezone.utc) + SESSION_EXPIRY

    # Store session in MongoDB
    await sessions_collection.insert_one({"user_id": user_id, "token": session_token, "expires": expiry_time})

    return session_token

# Get session from MongoDB by token
async def get_session(token: str):
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
async def register_user(username: str = Form(...), password: str = Form(...)):
    hashed_password = pwd_context.hash(password)
    user = {"username": username, "password": hashed_password, "role": "clinic"} # Default role is clinic
    await users_collection.insert_one(user)
    return {"message": "User registered successfully"}

# Login & Create Session
@router.post("/login")
async def login(response: Response, username: str = Form(...), password: str = Form(...)):
    user = await users_collection.find_one({"username": username})
    if not user or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    session_token = await create_session(user["_id"])
    
    # Set Secure HTTP-only Cookie with session token for the duration of the session
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    return {"message": "Login successful"}

# Logout (Remove session)
@router.post("/logout")
async def logout(response: Response, request: Request):
    token = request.cookies.get("session_token")
    if token:
        await sessions_collection.delete_one({"token": token})

    response.delete_cookie("session_token")
    return {"message": "Logged out"}

# Verify Token and Get User Role
@router.get("/verify-token")
async def verify_token(user=Depends(get_current_user)):
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
    if current_user["role"] != "clinic":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return {"message": "Welcome to the model trial page"}