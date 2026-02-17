"""
PrinterMonitor Pro - API Server

FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .database import init_db

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("="*80)
    print(f"{settings.PROJECT_NAME} v{settings.VERSION}")
    print("="*80)
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"API Prefix: {settings.API_V1_PREFIX}")
    print("="*80)
    
    # Initialize database
    init_db()
    
    print("✓ Server started successfully")
    print("="*80)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "docs": "/docs" if settings.ENVIRONMENT != "production" else "disabled",
        "health": "/health",
        "api": settings.API_V1_PREFIX
    }


# Include routers (we'll add these later)
# from .routes import auth, devices, metrics
# app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
# app.include_router(devices.router, prefix=f"{settings.API_V1_PREFIX}/devices", tags=["devices"])
# app.include_router(metrics.router, prefix=f"{settings.API_V1_PREFIX}/metrics", tags=["metrics"])
