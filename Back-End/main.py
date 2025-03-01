from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware # Cross-Origin Resource Sharing middleware
from routes.performance import router as performance_router # Import the performance router
from config.db import connect_to_mongo, close_mongo_connection # Import database connection functions
from contextlib import asynccontextmanager
import os

# Database connection context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()  # Connect to the MongoDB database
    yield  # Yield control back to the application
    await close_mongo_connection()  # Close the MongoDB connection when the app shuts down

# Create a FastAPI instance 
app = FastAPI(lifespan=lifespan)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Include the performance router with a prefix
app.include_router(performance_router, prefix='/api/performance')

# Path to the built frontend (for deployment on Railway)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "../dist")

# Serve static files from the 'assets' and 'dist' directory built by using 'npm run build'
app.mount("/assets", StaticFiles(directory="../dist/assets"), name="assets")
app.mount("/static", StaticFiles(directory="../dist"), name="static")

# Health check endpoint to verify the service is running
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Serve the frontend application
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    file_path = os.path.join(FRONTEND_DIST, "index.html")  # Path to the frontend's index.html
    return FileResponse(file_path)  # Return the index.html file

# Run the FastAPI app using Uvicorn when the script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # Run the app on host 0.0.0.0 and port 8000 with auto-reload enabled