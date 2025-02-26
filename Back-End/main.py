from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware # Cross-Origin Resource Sharing 
from routes.performance import router as performance_router
from config.db import connect_to_mongo, close_mongo_connection  # Import database connection functions
from contextlib import asynccontextmanager

# Database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

# FastAPI instance
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
app.include_router(performance_router, prefix='/api/performance')

# Serve static files
app.mount("/assets", StaticFiles(directory="../dist/assets"), name="assets")
app.mount("/static", StaticFiles(directory="../dist"), name="static")

# Serve the frontend
@app.get("/")
async def serve_frontend():
    return FileResponse("../dist/index.html")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)