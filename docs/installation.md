# PrinterMonitor Pro - Installation Guide

Complete guide to installing and configuring PrinterMonitor Pro for monitoring your network printers.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Installation Methods](#installation-methods)
- [Quick Start (Recommended)](#quick-start-recommended)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Registering Printers](#registering-printers)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Prerequisites

Before installing PrinterMonitor Pro, ensure you have:

### Required
- ✅ **A Linux device** on the same network as your printers
  - Raspberry Pi (any model)
  - Ubuntu/Debian server
  - Any Linux computer with network access
- ✅ **SNMP-enabled printers** on your network
  - Most modern network printers support SNMP
  - Usually enabled by default
- ✅ **Internet connection** on the Linux device
  - For sending data to PrinterMonitor Pro cloud
- ✅ **PrinterMonitor Pro account**
  - Sign up at https://app.prntr.org/register

### Recommended
- 🔧 Basic Linux command line knowledge
- 🔧 SSH access to your Linux device
- 🔧 Network admin access (for subnet configuration)

---

## System Requirements

### Minimum Hardware
- **CPU:** Any modern processor (even Raspberry Pi Zero works)
- **RAM:** 512 MB minimum (1 GB recommended)
- **Storage:** 1 GB free space
- **Network:** Ethernet or WiFi connection to printer network

### Supported Operating Systems
- ✅ Ubuntu 20.04+ (recommended)
- ✅ Debian 10+
- ✅ Raspberry Pi OS (Raspbian)
- ✅ CentOS 7+
- ✅ Fedora 30+
- ✅ Other Linux distributions (may require manual dependency installation)

### Network Requirements
- **Port 161 (SNMP):** Must be able to reach printers
- **Port 443 (HTTPS):** Outbound to api.prntr.org
- **Firewall:** Allow outbound HTTPS connections

---

## Installation Methods

Choose the method that works best for you:

| Method | Difficulty | Time | Best For |
|--------|-----------|------|----------|
| [Quick Start](#quick-start-recommended) | ⭐ Easy | 5 min | Most users |
| [Manual Installation](#manual-installation) | ⭐⭐⭐ Advanced | 15 min | Custom setups |

---

## Quick Start (Recommended)

### Step 1: Create Account

1. Go to https://app.prntr.org/register
2. Enter your details:
   - Full name
   - Email address
   - Password (minimum 8 characters)
3. Click **"Create account"**
4. You'll be automatically logged in with a **14-day Pro trial**

### Step 2: Get Your API Key

1. In the dashboard, click **"Settings"** in the top navigation
2. Click **"Proxy Devices"** in the sidebar
3. Click **"+ Add Device"** button
4. Enter a name for your device (e.g., "Office Raspberry Pi")
5. Click **"Register Device"**
6. **Copy your API key** - you'll only see this once!
   - Format: `pm_device_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

⚠️ **Important:** Save this API key securely. You cannot retrieve it later.

### Step 3: Install the Proxy

**On your Linux device**, run this single command:
```bash
curl -fsSL https://raw.githubusercontent.com/printmonitor/printermonitor-proxy/main/install.sh | sudo bash -s YOUR_API_KEY
```

Replace `YOUR_API_KEY` with the key you copied in Step 2.

**Example:**
```bash
curl -fsSL https://raw.githubusercontent.com/printmonitor/printermonitor-proxy/main/install.sh | sudo bash -s pm_device_kKWj8YiZQ1e94iVK_lOsePHXgXc5QKJ68QjG-A1Qd5U
```

### What Happens During Installation:

The installer will:
1. ✅ Detect your operating system
2. ✅ Install required dependencies (Python, pip, etc.)
3. ✅ Download PrinterMonitor Pro proxy software
4. ✅ Configure with your API key
5. ✅ Set up automatic startup (systemd service)
6. ✅ Start monitoring immediately

**Installation takes 2-5 minutes** depending on your internet speed.

### Step 4: Verify Installation

After installation completes, verify the service is running:
```bash
sudo systemctl status printermonitor-proxy
```

You should see:
```
● printermonitor-proxy.service - PrinterMonitor Pro Proxy Device
     Loaded: loaded
     Active: active (running) ✓
```

### Step 5: Check Your Dashboard

1. Go to https://app.prntr.org/dashboard
2. Wait 1-2 minutes for the proxy to discover printers
3. Your printers should appear automatically!

🎉 **Done!** You're now monitoring your printers in real-time.

---

## Manual Installation

For advanced users who want more control over the installation process.

### Step 1: Install Dependencies

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git
```

**CentOS/RHEL:**
```bash
sudo yum install -y python3 python3-pip git
```

**Raspberry Pi OS:**
```bash
sudo apt update
sudo apt install -y python3-pip python3-venv git
```

### Step 2: Download Proxy Software
```bash
# Create installation directory
sudo mkdir -p /opt/printermonitor
cd /opt/printermonitor

# Clone repository
sudo git clone https://github.com/printmonitor/printermonitor-proxy.git proxy
cd proxy
```

### Step 3: Set Up Python Environment
```bash
# Create virtual environment
sudo python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt
```

### Step 4: Configure
```bash
# Copy example configuration
cp .env.example .env

# Edit configuration
nano .env
```

**Modify these settings:**
```bash
# Required
MONITOR_MODE=cloud
CLOUD_API_URL=https://api.prntr.org
CLOUD_API_KEY=YOUR_API_KEY_HERE

# Optional (defaults are usually fine)
SNMP_COMMUNITY=public
MONITOR_INTERVAL=300
```

Save and exit (Ctrl+X, Y, Enter).

### Step 5: Create System Service
```bash
sudo cat > /etc/systemd/system/printermonitor-proxy.service << 'SERVICEEOF'
[Unit]
Description=PrinterMonitor Pro Proxy Device
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/printermonitor/proxy
Environment="PATH=/opt/printermonitor/proxy/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/opt/printermonitor/proxy/venv/bin/python src/main.py loop
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICEEOF
```

### Step 6: Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (start at boot)
sudo systemctl enable printermonitor-proxy

# Start service
sudo systemctl start printermonitor-proxy

# Check status
sudo systemctl status printermonitor-proxy
```

---

## Configuration

### SNMP Community String

Most printers use `public` as the default SNMP community string. If yours is different:

**Edit configuration:**
```bash
sudo nano /opt/printermonitor/proxy/.env
```

**Change:**
```bash
SNMP_COMMUNITY=your_custom_string
```

**Restart service:**
```bash
sudo systemctl restart printermonitor-proxy
```

### Monitoring Interval

By default, printers are checked every **5 minutes** (300 seconds).

**To change:**
```bash
# Edit config
sudo nano /opt/printermonitor/proxy/.env

# Modify (value in seconds)
MONITOR_INTERVAL=600  # 10 minutes
```

**Restart:**
```bash
sudo systemctl restart printermonitor-proxy
```

### Local Buffering

If internet connection is unreliable, enable local buffering to queue metrics:
```bash
CLOUD_ENABLE_BUFFER=true
```

Metrics are stored locally and sent when connection is restored.

---

## Registering Printers

### Automatic Discovery (Recommended)

The proxy automatically discovers SNMP-enabled printers on the same subnet. Just wait 5-10 minutes after installation.

### Manual Registration

If printers are on a different subnet, register them manually.

#### Via Dashboard (Easy)

1. Go to **Settings → Remote Subnets**
2. Click **"+ Add Subnet"**
3. Enter subnet in CIDR notation (e.g., `192.168.2.0/24`)
4. Click **"Add Subnet"**

The proxy will scan and register printers automatically.

#### Via Command Line (Advanced)
```bash
curl -X POST https://api.prntr.org/api/v1/printers \
  -H "X-API-Key: YOUR_DEVICE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "192.168.1.100",
    "name": "Office Printer",
    "location": "Building A - Floor 2",
    "model": "HP LaserJet Pro M404n"
  }'
```

Replace:
- `YOUR_DEVICE_API_KEY` - Your device API key
- `ip` - Printer IP address
- `name` - Friendly name for printer
- `location` - Physical location
- `model` - Printer model (optional)

---

## Troubleshooting

### Proxy Not Starting

**Check logs:**
```bash
sudo journalctl -u printermonitor-proxy -n 50
```

**Common issues:**
- Invalid API key → Check `.env` file
- Missing dependencies → Re-run installer
- Python version too old → Requires Python 3.8+

### No Printers Detected

**Verify SNMP is working:**
```bash
# Install SNMP tools
sudo apt install snmp

# Test SNMP connection to printer
snmpwalk -v2c -c public PRINTER_IP_ADDRESS
```

If you get a response, SNMP is working.

**Check if proxy can reach printer:**
```bash
ping PRINTER_IP_ADDRESS
```

**Common causes:**
- SNMP disabled on printer → Enable in printer settings
- Wrong SNMP community string → Check printer docs
- Firewall blocking SNMP (port 161) → Allow in firewall
- Printer on different subnet → Use manual registration

### Printers Show "Disconnected"

**Possible reasons:**
- Printer powered off → Turn on printer
- Network issue → Check connectivity
- SNMP disabled → Re-enable on printer
- Printer IP changed → Update printer IP in dashboard

**Check proxy logs:**
```bash
sudo journalctl -u printermonitor-proxy -f
```

Look for error messages related to the printer.

### Service Keeps Restarting

**View error logs:**
```bash
sudo journalctl -u printermonitor-proxy -xe
```

**Common fixes:**
- Configuration error → Check `.env` file
- Missing Python package → Reinstall dependencies
- Network unreachable → Check internet connection

### API Connection Failed

**Test API connection:**
```bash
curl -I https://api.prntr.org/health
```

Should return `200 OK`.

**If fails:**
- Check internet connection
- Check firewall rules (allow HTTPS outbound)
- Verify API key is correct

---

## Useful Commands

### Service Management
```bash
# Check status
sudo systemctl status printermonitor-proxy

# Start service
sudo systemctl start printermonitor-proxy

# Stop service
sudo systemctl stop printermonitor-proxy

# Restart service
sudo systemctl restart printermonitor-proxy

# View logs (live)
sudo journalctl -u printermonitor-proxy -f

# View last 100 log lines
sudo journalctl -u printermonitor-proxy -n 100
```

### Test Monitoring Manually

Run monitoring once without service:
```bash
cd /opt/printermonitor/proxy
source venv/bin/activate
python src/main.py once
```

This is useful for debugging.

### Update Proxy Software
```bash
cd /opt/printermonitor/proxy
sudo git pull
sudo systemctl restart printermonitor-proxy
```

---

## Next Steps

After successful installation:

1. **📊 Explore Dashboard**
   - View printer metrics
   - Check toner levels
   - Review historical data

2. **⚙️ Configure Settings**
   - Add remote subnets
   - Set up additional devices
   - Customize monitoring interval

3. **🔔 Set Up Alerts** *(coming soon)*
   - Email notifications
   - Low toner alerts
   - Printer offline alerts

4. **💳 Manage Subscription**
   - View current plan
   - Upgrade if needed
   - Set billing information

5. **📖 Read User Guide** *(coming soon)*
   - Learn all features
   - Best practices
   - Advanced configuration

---

## Need Help?

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/printmonitor/printermonitor-proxy/issues)
- 💬 **Questions:** [GitHub Discussions](https://github.com/printmonitor/printermonitor-pro/discussions)
- 📧 **Email Support:** support@prntr.org *(coming soon)*

---

## Appendix

### Supported Printer Brands

PrinterMonitor Pro works with any SNMP-enabled printer, including:

- ✅ HP / Hewlett-Packard
- ✅ Canon
- ✅ Epson
- ✅ Brother
- ✅ Xerox
- ✅ Ricoh
- ✅ Kyocera
- ✅ Samsung
- ✅ Lexmark
- ✅ Dell
- ✅ And many more...

### SNMP OIDs Used

For technical reference, we query these standard SNMP OIDs:

- **System Description:** `1.3.6.1.2.1.1.1.0`
- **Printer Model:** `1.3.6.1.2.1.25.3.2.1.3.1`
- **Total Page Count:** `1.3.6.1.2.1.43.10.2.1.4.1.1`
- **Toner Level:** `1.3.6.1.2.1.43.11.1.1.9.1.1`
- **Device Status:** `1.3.6.1.2.1.25.3.2.1.5.1`

### Security Considerations

- 🔒 Proxy stores API key in local `.env` file (chmod 600)
- 🔒 All communication with cloud is encrypted (HTTPS/TLS)
- 🔒 Printer data never leaves your network (only metrics sent)
- 🔒 No direct access to printers from internet
- 🔒 SNMP community string stored locally only

---

<div align="center">

**Installation Guide v1.0** • Last Updated: February 2026

[Main Documentation](../README.md) • [Troubleshooting](troubleshooting.md) • [API Docs](api.md)

</div>
