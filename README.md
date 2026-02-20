# PrinterMonitor Pro

> **Monitor your printers in real-time. Never run out of toner unexpectedly.**

[![Status: Beta](https://img.shields.io/badge/Status-Beta-yellow.svg)](https://prntr.org)

A complete SaaS platform for monitoring SNMP-enabled printers across your network.

🌐 **Website:** [https://prntr.org](https://prntr.org) (Under Development)  
📊 **Dashboard:** [https://app.prntr.org](https://app.prntr.org)  
🔌 **API:** [https://api.prntr.org](https://api.prntr.org)

---

## 📦 Repositories

This project is split into multiple repositories:

- **[printermonitor-proxy](https://github.com/printmonitor/printermonitor-proxy)** (Public) - Open source monitoring proxy device
- **printermonitor-api** (Private) - Backend API service
- **printermonitor-dashboard** (Private) - Web dashboard application

---

## 🚀 Quick Start

### Installation

1. **Sign up** at [app.prntr.org/register](https://app.prntr.org/register) *(when launched)*
2. **Get your API key** from Settings → Proxy Devices
3. **Install the proxy** on a Linux device:
```bash
curl -fsSL https://raw.githubusercontent.com/printmonitor/printermonitor-proxy/main/install.sh | sudo bash -s YOUR_API_KEY
```

4. **Done!** Printers appear in your dashboard automatically.

---

## ✨ Features

### 🖨️ Real-Time Monitoring
- Track toner levels across all printers
- Monitor page counts and usage patterns
- View printer status (online/offline)
- Automatic SNMP discovery

### 📊 Analytics & Insights
- Historical metrics with interactive graphs
- Trend analysis (7, 30, 90 days)
- Predict when toner will run out
- Usage optimization recommendations

### 🌐 Multi-Network Support
- Monitor printers across multiple subnets
- Remote network scanning
- Centralized dashboard for all locations
- Support for distributed offices

### 🚀 Easy Deployment
- **One-line installer** - 5 minute setup
- Works with any SNMP-enabled printer
- Runs on Raspberry Pi or any Linux device
- Auto-updates and self-healing

### 🔒 Security & Privacy
- Self-hosted proxy (data stays on your network)
- Encrypted API communication (SSL/TLS)
- JWT-based authentication
- Secure key management

### 💳 Flexible Pricing
- **Free tier** for personal use (3 printers)
- **Paid tiers** for businesses
- **14-day free trial** on all paid plans
- Cancel anytime, no contracts

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

## 🏗️ Architecture
```
┌─────────────────┐
│  Web Dashboard  │  Next.js + React
│  app.prntr.org  │  (Private Repo)
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Backend API   │  FastAPI + PostgreSQL
│  api.prntr.org  │  (Private Repo)
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐       SNMP      ┌──────────────┐
│  Proxy Device   │ ◄──────────────► │   Printers   │
│  (Open Source)  │    (Port 161)    │  (Network)   │
└─────────────────┘                  └──────────────┘
```

**Tech Stack:**
- **Frontend:** Next.js 16, React 18, TypeScript, Tailwind CSS
- **Backend:** FastAPI, PostgreSQL 14, Stripe
- **Proxy:** Python 3.10, SNMP (pysnmp)
- **Infrastructure:** Linux VPS, Nginx, Let's Encrypt

---

## 📖 Documentation

### For Users
- [Installation Guide](docs/installation.md) *(coming soon)*
- [User Guide](docs/user-guide.md) *(coming soon)*
- [Troubleshooting](docs/troubleshooting.md) *(coming soon)*

### For Developers
- [API Documentation](docs/api.md) *(coming soon)*
- [Contributing Guide](docs/contributing.md) *(coming soon)*
- See individual repositories for setup instructions

---

## 🤝 Contributing

We welcome contributions to the **proxy device** (open source)!

1. Fork [printermonitor-proxy](https://github.com/printmonitor/printermonitor-proxy)
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

For API or Dashboard contributions, please contact us.

---

## 📋 Roadmap

- [x] Core monitoring functionality
- [x] Web dashboard
- [x] Multi-network support
- [x] One-line installer
- [ ] Email/SMS alerts
- [ ] Mobile app (iOS/Android)
- [ ] Slack/Teams integration
- [ ] Advanced analytics & ML predictions
- [ ] Multi-user organizations
- [ ] White-label option

---

## ⚠️ Status

**Currently under development - Not accepting customers yet.**

We're actively building and testing the platform. Launch is planned for **Q2 2026**.

⭐ Star this repo to follow our progress!

---

## 📞 Support

- 🐛 **Issues:** [GitHub Issues](https://github.com/printmonitor/printermonitor-pro/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/printmonitor/printermonitor-pro/discussions)
- 📧 **Email:** support@prntr.org *(coming soon)*

---

## 📜 License

- **Proxy Device:** MIT License (Open Source)
- **API & Dashboard:** Proprietary

See individual repositories for details.

---

## 🙏 Acknowledgments

Built with amazing open source tools:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework
- [pysnmp](https://github.com/pysnmp/pysnmp) - SNMP library
- [Recharts](https://recharts.org/) - React charting library

---

<div align="center">

**[Website](https://prntr.org)** • **[Dashboard](https://app.prntr.org)** • **[Proxy (Open Source)](https://github.com/printmonitor/printermonitor-proxy)**

Made with ❤️ for IT professionals everywhere

</div>
