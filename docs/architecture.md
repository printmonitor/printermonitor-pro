# Architecture Overview

## System Components

### Proxy Device
- Runs on local network (Raspberry Pi, Linux server)
- Discovers OctoPrint instances via mDNS
- Collects printer status data
- Forwards to cloud API
- Buffers data locally when offline

### Cloud Server
- REST API for data ingestion and retrieval
- User authentication and authorization
- License management
- Database storage

### Web Dashboard
- User interface for monitoring
- Account management
- Device configuration
- Historical data visualization

## Data Flow
```
Printers (OctoPrint) 
    ↓ (HTTP)
Proxy Device (local network)
    ↓ (HTTPS/WSS)
Cloud API Server
    ↓
Database (PostgreSQL)
    ↑
Web Dashboard (user's browser)
```

## Technology Decisions

### To Be Decided:
- [ ] Backend language: Python (FastAPI) vs Node.js (Express)
- [ ] Frontend framework: Next.js vs Nuxt.js
- [ ] Deployment platform: DigitalOcean vs AWS
- [ ] Proxy distribution: Docker vs native packages

## Security Considerations

- All data in transit encrypted (TLS)
- API authentication via JWT
- Device authentication via API keys
- Rate limiting on all endpoints
- SQL injection prevention
- XSS prevention
