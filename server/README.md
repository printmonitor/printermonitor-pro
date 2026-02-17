# PrinterMonitor Pro - API Server

Cloud backend for PrinterMonitor Pro.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up PostgreSQL

Install PostgreSQL and TimescaleDB (optional but recommended).

Create database:
```sql
CREATE DATABASE printermonitor;
CREATE USER printermon WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE printermonitor TO printermon;
```

### 3. Configure Environment
```bash
cp .env.example .env
nano .env  # Edit configuration
```

### 4. Run Server
```bash
# Development
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 5. Test

Visit:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## 📁 Structure
```
server/
├── src/
│   ├── main.py          # FastAPI app
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── routes/          # API endpoints
│   └── auth/            # Authentication
├── migrations/          # Alembic migrations
└── tests/              # Tests
```

## 🔧 Development

Run in development mode:
```bash
uvicorn src.main:app --reload
```

## 📊 API Documentation

When running, visit `/docs` for interactive API documentation.

---

**Version:** 1.0.0-alpha  
**Status:** Development
