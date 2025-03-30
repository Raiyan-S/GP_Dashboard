from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware # Cross-Origin Resource Sharing middleware
from routes.route import router as router
from routes.auth import router as auth_router
from routes.predict import router as predict_router
from config.db import open_connection, close_connection

from contextlib import asynccontextmanager
import os

from rateLimiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

# Database connection context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    await open_connection()
    yield
    await close_connection()
    
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
    allow_origins= origins,  # allow for development purposes for now
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Rate limiting middleware
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )
    
# Include the router
app.include_router(router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")
app.include_router(predict_router, prefix="/api/modeltrial")

# Serve static files from the 'assets' and 'dist' directory built by using 'npm run build'
app.mount("/assets", StaticFiles(directory="../dist/assets"), name="assets")
app.mount("/static", StaticFiles(directory="../dist"), name="static")

# Path to the built frontend (for deployment on Railway)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "../dist")
        
# Serve the frontend application
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    file_path = os.path.join(FRONTEND_DIST, "index.html")  # Path to the frontend's index.html
    return FileResponse(file_path)  # Return the index.html file

# Run the FastAPI app using Uvicorn when the script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # Run the app on host 0.0.0.0 and port 8000 with auto-reload enabled