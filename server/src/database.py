"""
Database Connection and Session Management

Handles SQLAlchemy setup and session management
"""

from sqlalchemy import create_engine, event, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from .config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=NullPool if settings.ENVIRONMENT == "test" else None,
    echo=settings.ENVIRONMENT == "development",  # Log SQL in dev
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


# Dependency for FastAPI routes
def get_db():
    """
    Database session dependency for FastAPI
    
    Usage in routes:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Initialize TimescaleDB extension
def init_timescaledb():
    """
    Initialize TimescaleDB extension and create hypertable
    Should be called after creating tables
    """
    try:
        with engine.connect() as conn:
            # Create TimescaleDB extension if not exists
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"))
            
            # Convert printer_metrics to hypertable
            conn.execute(text("""
                SELECT create_hypertable(
                    'printer_metrics', 
                    'timestamp',
                    if_not_exists => TRUE
                );
            """))
            
            conn.commit()
            
            print("✓ TimescaleDB extension initialized")
            print("✓ printer_metrics converted to hypertable")
    except Exception as e:
        print(f"⚠ TimescaleDB initialization skipped: {e}")
        print("  (This is normal if using SQLite or if TimescaleDB is not installed)")


def init_db():
    """
    Initialize database
    Creates all tables
    """
    # Import all models to ensure they're registered with Base
    from .models import User, ProxyDevice, Printer, PrinterMetrics
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("✓ Database tables created")
    
    # Initialize TimescaleDB (will skip if not available)
    init_timescaledb()
