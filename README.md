# PrinterMonitor Pro

> **Monitor your printers in real-time. Never run out of toner unexpectedly.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Beta](https://img.shields.io/badge/Status-Beta-yellow.svg)](https://prntr.org)

A complete SaaS platform for monitoring SNMP-enabled printers across your network. Track toner levels, page counts, and printer status from a beautiful web dashboard.

🌐 **Website:** [https://prntr.org](https://prntr.org) (Under Development)  
📊 **Dashboard:** [https://app.prntr.org](https://app.prntr.org)  
🔌 **API:** [https://api.prntr.org](https://api.prntr.org)

---

## ✨ Features

### 🖨️ Real-Time Monitoring
- Track toner levels across all printers
- Monitor page counts and usage
- View printer status (online/offline)
- Automatic discovery via SNMP

### 📊 Analytics & Insights
- Historical metrics with interactive graphs
- Trend analysis over 7, 30, or 90 days
- Predict when toner will run out
- Track printer usage patterns

### 🌐 Multi-Network Support
- Monitor printers across multiple subnets
- Configure remote network scanning
- Centralized dashboard for all locations
- Support for distributed offices

### 🚀 Easy Deployment
- **One-line installer** - Get started in 5 minutes
- Works with any SNMP-enabled printer
- Lightweight proxy device (Raspberry Pi, Linux server)
- Auto-updates and self-healing

### 🔒 Security & Privacy
- Self-hosted proxy keeps printer data on your network
- Encrypted API communication (SSL/TLS)
- JWT-based authentication
- Role-based access control (planned)

### 💳 Flexible Pricing
- Free tier for personal use (up to 3 printers)
- Paid tiers for businesses
- 14-day free trial on all paid plans
- Cancel anytime

---

## 🏗️ Architecture
```
┌─────────────────┐
│  Web Dashboard  │  (Next.js + React)
│  app.prntr.org  │  
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Backend API   │  (FastAPI + PostgreSQL)
│  api.prntr.org  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐       SNMP      ┌──────────────┐
│  Proxy Device   │ ◄──────────────► │   Printers   │
│  (Python)       │      (Port 161)  │  (Network)   │
└─────────────────┘                  └──────────────┘
```

**Components:**
- **Frontend:** Next.js 16, React 18, TypeScript, Tailwind CSS
- **Backend:** FastAPI, PostgreSQL 14, JWT auth, Stripe integration
- **Proxy:** Python 3.10, SNMP (pysnmp), SQLite buffer
- **Infrastructure:** Linux VPS, Nginx, SSL (Let's Encrypt)

---

## 🚀 Quick Start

### Prerequisites
- Linux device on same network as printers (Raspberry Pi, Ubuntu server, etc.)
- Printers with SNMP enabled (most network printers support this)
- SNMP community string (usually "public")

### Installation

1. **Create an account** at [https://app.prntr.org/register](https://app.prntr.org/register) *(when launched)*

2. **Get your API key** from Settings → Proxy Devices

3. **Install the proxy** on a Linux device:
```bash
curl -fsSL https://raw.githubusercontent.com/printmonitor/printermonitor-pro/main/proxy/install.sh | sudo bash -s YOUR_API_KEY
```

4. **Done!** Your printers will appear in the dashboard automatically.

---

## 📖 Documentation

### Manual Printer Registration

If you need to monitor printers on a different subnet:
```bash
curl -X POST https://api.prntr.org/api/v1/printers \
  -H "X-API-Key: YOUR_DEVICE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "192.168.1.100",
    "name": "Office Printer",
    "location": "Building A",
    "model": "HP LaserJet Pro"
  }'
```

### Remote Subnet Scanning

Add remote subnets via the dashboard:
1. Go to Settings → Remote Subnets
2. Add subnet in CIDR notation (e.g., `192.168.2.0/24`)
3. Proxy will automatically scan and register printers

### Checking Proxy Status
```bash
# View service status
sudo systemctl status printermonitor-proxy

# View logs
sudo journalctl -u printermonitor-proxy -f

# Restart service
sudo systemctl restart printermonitor-proxy
```

---

## 💰 Pricing

| Plan | Price | Devices | Printers | History |
|------|-------|---------|----------|---------|
| **Free** | $0/mo | 1 | 3 | 7 days |
| **Maker** | $10/mo | 2 | 10 | 90 days |
| **Pro** | $50/mo | 5 | 50 | 1 year |
| **Enterprise** | $150/mo | 10 | Unlimited | Unlimited |

💡 **14-day free trial** on all paid plans  
💳 **No credit card required** to start  
📈 **Save 17%** with annual billing

---

## 🛠️ Development

### Local Development Setup

#### Backend
```bash
cd server
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# Set up database
createdb printermonitor
cp .env.example .env
# Edit .env with your settings

# Run migrations
python -m alembic upgrade head

# Start server
uvicorn src.main:app --reload
```

#### Frontend
```bash
cd dashboard
npm install
cp .env.example .env.local
# Edit .env.local with API URL

# Start dev server
npm run dev
```

#### Proxy
```bash
cd proxy
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your settings

# Run once
python src/main.py once

# Run continuously
python src/main.py loop
```

---

## 📁 Project Structure
```
printermonitor-pro/
├── server/              # Backend API (FastAPI)
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── auth/        # Authentication
│   └── requirements.txt
├── dashboard/           # Frontend (Next.js)
│   ├── app/             # App router pages
│   ├── lib/             # API client & utilities
│   └── package.json
├── proxy/               # Monitoring proxy (Python)
│   ├── src/
│   │   ├── monitoring/  # SNMP monitoring
│   │   ├── storage/     # Cloud & local storage
│   │   └── discovery/   # Network scanning
│   ├── install.sh       # One-line installer
│   └── requirements.txt
└── landing/             # Landing page
    └── index.html
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📋 Roadmap

- [x] Core monitoring functionality
- [x] Web dashboard
- [x] Multi-network support
- [x] One-line installer
- [ ] Email/SMS alerts
- [ ] Mobile app (iOS/Android)
- [ ] Slack/Teams integration
- [ ] Advanced analytics
- [ ] Multi-user organizations
- [ ] White-label option

---

## 🐛 Known Issues

- Remote subnet scanning requires manual printer registration (auto-discovery coming soon)
- Limited to SNMP v2c (v3 support planned)
- Email notifications not yet implemented

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [Next.js](https://nextjs.org/)
- SNMP monitoring via [pysnmp](https://github.com/pysnmp/pysnmp)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

- 📧 Email: support@prntr.org *(coming soon)*
- 🐛 Issues: [GitHub Issues](https://github.com/printmonitor/printermonitor-pro/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/printmonitor/printermonitor-pro/discussions)

---

## ⚠️ Status

**This project is currently under development and not accepting customers yet.**

We're actively building and testing the platform. Launch is planned for Q2 2026.

Star this repo to follow our progress! ⭐

---

<div align="center">

**[Website](https://prntr.org)** • **[Dashboard](https://app.prntr.org)** • **[Documentation](https://docs.prntr.org)** *(coming soon)*

Made with ❤️ for IT professionals everywhere

</div>
