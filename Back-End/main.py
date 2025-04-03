from fastapi import FastAPI 
from fastapi.staticfiles import StaticFiles # Used to serve static files
from fastapi.responses import FileResponse  # Used to serve files (eg. index.html)
# from fastapi.middleware.cors import CORSMiddleware # Middleware for CORS (Cross-Origin Resource Sharing)

# Importing routers and database connection functions
from routes.route import router as router
from routes.auth import router as auth_router
from routes.predict import router as predict_router
from config.db import open_connection, close_connection

from contextlib import asynccontextmanager # Manage application lifecycle
import os # Used to handle file paths

# Importing the slowapi rate limiter
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
    
# Create a FastAPI instance with a lifespan context manager
# This context manager opens and closes the database connection when the app starts and stops
app = FastAPI(lifespan=lifespan)

# # Defined allowed frontend origins
# origins = [
#     "http://localhost:8000", # Local using uvicorn FastAPI
#     "https://gpdashboard-production.up.railway.app" # Railway
# ]

# # CORS middleware to allow cross-origin requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins= origins,
#     allow_credentials=True,
#     allow_methods=["*"],  
#     allow_headers=["*"],  
# )

# Rate limiting middleware
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )
    
# Include the routers for different routes
# The routers are defined in separate modules for better organization
app.include_router(router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")
app.include_router(predict_router, prefix="/api/modeltrial")

# Serve static files from the 'assets' directory built by using 'npm run build'
# Assets include CSS and JavaScript files
app.mount("/assets", StaticFiles(directory="../dist/assets"), name="assets")

# Path to the built frontend (for deployment on Railway)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "../dist")
        
# Serve the frontend application
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    file_path = os.path.join(FRONTEND_DIST, "index.html")  # Path to the frontend's index.html
    return FileResponse(file_path)  

# Run the FastAPI app using Uvicorn when the script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # Run the app on host 0.0.0.0 and port 8000 with auto-reload enabled