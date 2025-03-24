from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware # Cross-Origin Resource Sharing middleware
from routes.route import router as router # Import the router

from beanie import init_beanie
from config.db import User, AccessToken, db
from routes.auth import auth_backend, current_active_user, fastapi_users
from models.user import UserRead, UserCreate, UserUpdate

from contextlib import asynccontextmanager
import os

# Database connection context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_beanie(
        database=db,
        document_models=[
            User,
            AccessToken,
        ],
    )
    yield
    
# Create a FastAPI instance 
app = FastAPI(lifespan=lifespan)

# Defined allowed frontend origins
origins = [
    "http://localhost:8000", # Local using uvicorn FastAPI
    "http://localhost:5173", # Local using npm run dev 
    "https://gpdashboard-production.up.railway.app" # Railway
]

# CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],  # allow for development purposes for now
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Include the router
app.include_router(router)

app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/cookies", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

@app.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}

# Path to the built frontend (for deployment on Railway)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "../dist")

# Serve static files from the 'assets' and 'dist' directory built by using 'npm run build'
app.mount("/assets", StaticFiles(directory="../dist/assets"), name="assets")
app.mount("/static", StaticFiles(directory="../dist"), name="static")

# Health check endpoint to verify the service is running
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# ping mongo endpoint
import motor.motor_asyncio
# MongoDB connection URI (currently only works on railway not local)
MONGO_URI = "mongodb://mongo:HiwDMYxRRpgqkefLILYZynRVwRWqImpy@autorack.proxy.rlwy.net:44467"

# Create a MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

# Ping MongoDB to check the connection 
@app.get("/ping_mongo")
async def ping_mongo():
    try:
        await client.admin.command("ping")
        return {"status": "MongoDB connection successful"}
    except Exception as e:
        return {"status": "MongoDB connection failed", "error": str(e)}
        
# Serve the frontend application
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    file_path = os.path.join(FRONTEND_DIST, "index.html")  # Path to the frontend's index.html
    return FileResponse(file_path)  # Return the index.html file

# Run the FastAPI app using Uvicorn when the script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # Run the app on host 0.0.0.0 and port 8000 with auto-reload enabled