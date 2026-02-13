"""
Application configuration settings
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings"""
    
    DATABASE_URL:str = "postgresql://ledger_db_qfgn_user:yS4eB9el29ypopyZm59vy2ssPUzODkyQ@dpg-d655hkp4tr6s73867m4g-a.oregon-postgres.render.com/ledger_db_qfgn"

    # if DATABASE_URL.startswith("postgresql://"):
    #     DATABASE_URL = DATABASE_URL.replace(
    #         "postgresql://", "postgresql+asyncpg://"
    #     )
    # API
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "https://ledger-webapp.vercel.app",
        "https://ledger-webapp.onrender.com/api/v1/",
        "https://ledger-web-app-six.vercel.app/"
    ]
    
    # JWT Auth
    JWT_SECRET_KEY: str = "ledger-app-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 8
    
    class Config:
        env_file = ".env"


settings = Settings()
