"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.api.routers import auth, parties, transaction_types, transactions
import app.models.admin  # noqa: F401 - ensure Admin table is created

# Create database tables
Base.metadata.create_all(bind=engine)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


# Initialize FastAPI app
app = FastAPI(
    title="Ledger Web Application API",
    description="Real-time ledger web application for small business",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(parties.router, prefix=settings.API_V1_PREFIX)
app.include_router(transaction_types.router, prefix=settings.API_V1_PREFIX)
app.include_router(transactions.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Ledger Web Application API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
