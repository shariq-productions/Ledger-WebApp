"""
Application configuration settings
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings"""
    
    DATABASE_URL = os.getenv("DATABASE_URL")

    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgresql://", "postgresql+asyncpg://"
        )
    # API
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "https://ledger-webapp.vercel.app",
        "https://ledger-webapp.onrender.com/api/v1/"
    ]
    
    # JWT Auth
    JWT_SECRET_KEY: str = "ledger-app-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 8
    
    class Config:
        env_file = ".env"


settings = Settings()
