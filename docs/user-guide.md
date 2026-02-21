# PrinterMonitor Pro - User Guide

Complete guide to using PrinterMonitor Pro for monitoring and managing your network printers.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Viewing Printers](#viewing-printers)
- [Printer Details](#printer-details)
- [Managing Devices](#managing-devices)
- [Settings](#settings)
- [Remote Subnets](#remote-subnets)
- [Billing & Subscription](#billing--subscription)
- [Tips & Best Practices](#tips--best-practices)
- [FAQ](#faq)

---

## Getting Started

### First Login

After creating your account and installing the proxy device:

1. Go to https://app.prntr.org/login
2. Enter your email and password
3. Click **"Login"**

You'll see your dashboard with all discovered printers.

### Understanding Your Trial

New accounts start with a **14-day Pro trial** which includes:
- ✅ Up to 5 proxy devices
- ✅ Up to 50 printers
- ✅ 1 year of historical data
- ✅ Full feature access

After the trial, you can choose a plan or continue with the free tier.

---

## Dashboard Overview

The main dashboard shows all your printers at a glance.

### Dashboard Components

**Navigation Bar**
- **PrinterMonitor Pro** logo - Click to return to dashboard
- **Dashboard** - Main printer overview (you are here)
- **Printers** - Detailed printer list
- **Billing** - Manage subscription
- **Settings** - Configure devices and subnets
- **User email** - Shows logged-in account
- **Logout** - Sign out

**Printer Cards**
Each printer is displayed as a card showing:
- 🖨️ **Printer Name** - Friendly name (e.g., "Office Printer")
- 📍 **Location** - Physical location if set
- 🌐 **IP Address** - Network IP (e.g., 192.168.1.100)
- 📄 **Total Pages** - Lifetime page count
- 🎨 **Toner Level** - Current toner percentage
  - 🟢 Green (>50%) - Healthy
  - 🟡 Yellow (20-50%) - Monitor
  - 🔴 Red (<20%) - Order soon!
- 🔌 **Status Badge**
  - 🟢 Connected - Printer is online
  - 🔴 Disconnected - Printer offline or unreachable
- ⏰ **Last Updated** - When metrics were last collected

**Empty State**
If no printers are showing:
- Wait 5-10 minutes for auto-discovery
- Check proxy device is running
- Verify printers have SNMP enabled
- See [Troubleshooting](installation.md#troubleshooting)

---

## Viewing Printers

### Printer List View

Click **"Printers"** in the navigation to see all printers in a table format.

**Table Columns:**
- **Printer** - Name and model
- **Location** - Where the printer is located
- **IP Address** - Network address
- **Status** - Connected/Disconnected badge
- **Last Seen** - Last successful check
- **Actions** - View or Delete

**Actions:**
- **View** - Opens detailed printer page
- **Delete** - Removes printer (with confirmation)

⚠️ Deleting a printer also removes all historical metrics data.

### Filtering & Sorting

*Coming soon:*
- Search by name or IP
- Filter by status
- Sort by location, toner level, or page count

---

## Printer Details

Click on any printer card or "View" button to see detailed information.

### Information Cards

**Location Card**
- Physical location of the printer
- Set via manual registration or auto-discovery

**IP Address Card**
- Network IP address
- Used for SNMP monitoring

**Total Pages Card**
- Lifetime page count from printer
- Useful for tracking usage and maintenance schedules

**Toner Level Card**
- Current toner percentage
- Color-coded for quick status check

### Historical Metrics

View trends over time with interactive graphs.

**Time Range Selector**
- **7 days** - Recent activity (default)
- **30 days** - Monthly trends
- **90 days** - Quarterly overview

*Note: Data retention depends on your plan tier.*

**Toner Level Graph**
- Shows toner depletion over time
- Helps predict when to order replacements
- Hover over points for exact values

**Page Count Graph**
- Shows cumulative page count growth
- Identifies usage patterns
- Useful for capacity planning

### Understanding the Graphs

**Reading Toner Trends:**
- Steep decline = Heavy usage period
- Flat line = Printer not in use
- Sudden jump = Toner replaced

**Reading Page Count:**
- Steady climb = Regular usage
- Steep increase = High usage period
- Flat line = Printer idle

---

## Managing Devices

Devices are the proxy servers that monitor your printers.

### Viewing Devices

1. Click **Settings** in navigation
2. Click **Proxy Devices** in sidebar

You'll see all registered devices with:
- 📱 **Device Name** - Friendly name (e.g., "Office Raspberry Pi")
- 🟢 **Status** - Online/Offline
- 📦 **Version** - Proxy software version
- 📅 **Created** - Registration date
- ⏰ **Last Seen** - Last contact with cloud

### Adding a Device

1. Click **"+ Add Device"**
2. Enter a descriptive name
3. Click **"Register Device"**
4. **Copy the API key** immediately
5. Install proxy on your Linux device:
```bash
curl -fsSL https://raw.githubusercontent.com/printmonitor/printermonitor-proxy/main/install.sh | sudo bash -s YOUR_API_KEY
```

⚠️ **Important:** Save the API key! You cannot retrieve it later.

### Device Best Practices

**Naming Convention:**
Use descriptive names that indicate:
- Location: "Office-Floor2-Pi"
- Purpose: "Marketing-Dept-Monitor"
- Device type: "MainOffice-RaspberryPi"

**Device Placement:**
- Place on same network as printers
- Ensure reliable power supply
- Use wired ethernet when possible (more reliable than WiFi)
- Keep device accessible for troubleshooting

### Device Limits by Plan

| Plan | Max Devices |
|------|------------|
| Free | 1 |
| Maker | 2 |
| Pro | 5 |
| Enterprise | 10 |

---

## Settings

Access all configuration options in the Settings menu.

### Settings Sections

**Proxy Devices**
- View and manage monitoring devices
- Register new devices
- Check device status

**Remote Subnets**
- Configure networks to scan for printers
- Monitor printers on different subnets
- Auto-discovery across networks

**Manual Printers**
- Instructions for manual printer registration
- API command examples
- Advanced configuration

---

## Remote Subnets

Monitor printers across multiple networks.

### What Are Remote Subnets?

Remote subnets are network ranges outside your proxy's local subnet. Use this feature to:
- Monitor printers in different buildings
- Scan remote office networks
- Centralize monitoring across locations

### Adding a Subnet

1. Go to **Settings → Remote Subnets**
2. Click **"+ Add Subnet"**
3. Enter subnet in CIDR notation:
   - `192.168.2.0/24` - Scans 192.168.2.1 through 192.168.2.254
   - `10.0.0.0/16` - Large network (not recommended, slow)
   - `172.16.1.0/24` - Standard office subnet
4. Add description (e.g., "Building B Network")
5. Optionally assign to specific device
6. Click **"Add Subnet"**

### Subnet Status

Each subnet shows:
- 🌐 **Subnet** - Network range in CIDR notation
- 📝 **Description** - Your custom label
- 🟢 **Enabled/Disabled** - Scanning status
- 📅 **Added** - Creation date
- ⏰ **Last Scanned** - Most recent scan

### Managing Subnets

**Enable/Disable Scanning:**
- Click **"Disable"** to pause scanning
- Click **"Enable"** to resume
- Useful for temporary networks

**Delete Subnet:**
- Click **"Delete"** button
- Confirm deletion
- Printers already discovered remain until manually deleted

### Subnet Scanning

**How It Works:**
1. Proxy scans subnet every ~50 minutes
2. Checks each IP for SNMP response
3. Identifies printer devices
4. Auto-registers new printers
5. Updates dashboard

**Performance:**
- Small subnet (/24 = 254 IPs): ~2-5 minutes
- Large subnet (/16): Limited to first 254 IPs for performance

**Best Practices:**
- Use smallest subnet range needed
- Disable unused subnets
- One subnet per physical location works best

---

## Billing & Subscription

Manage your subscription and view usage.

### Current Plan

View your active plan details:
- 💳 **Plan Name** - Free, Maker, Pro, or Enterprise
- 📊 **Status** - Trial, Active, or Expired
- ⏰ **Trial End** - When trial expires (if applicable)
- 📅 **Next Billing** - Upcoming charge date

### Pricing Tiers

**Free Plan** - $0/month
- 1 device
- 3 printers
- 7 days history
- Perfect for: Home use, single printer

**Maker Plan** - $10/month
- 2 devices
- 10 printers
- 90 days history
- Perfect for: Small office, home office

**Pro Plan** - $50/month ⭐ Most Popular
- 5 devices
- 50 printers
- 1 year history
- API access
- Perfect for: Medium business, multiple locations

**Enterprise Plan** - $150/month
- 10 devices
- Unlimited printers
- Unlimited history
- Priority support
- Perfect for: Large organizations

💡 **Save 17%** with annual billing on all paid plans!

### Upgrading Your Plan

1. Click **Billing** in navigation
2. Find the plan you want
3. Click **"Upgrade"** button
4. Enter payment details (Stripe secure checkout)
5. Confirm subscription

**What Happens:**
- ✅ Immediate access to new limits
- ✅ Trial converts to paid (if in trial)
- ✅ Charged at plan rate
- ✅ Recurring billing starts

### Downgrading

To downgrade or cancel:
1. Email support@prntr.org *(coming soon)*
2. Changes take effect at end of billing period
3. Data within new limits preserved

### Usage Monitoring

View current usage vs. limits:
- **Devices:** X / Y active
- **Printers:** X / Y monitored
- **History:** X days retained

⚠️ Exceeding limits may pause monitoring until you upgrade.

---

## Tips & Best Practices

### Maximize Monitoring Effectiveness

**Regular Checks:**
- Check dashboard weekly for low toner alerts
- Review historical trends monthly
- Plan replacements before toner runs out

**Printer Organization:**
- Use clear, descriptive printer names
- Set accurate locations
- Group by building/floor/department

**Maintenance Scheduling:**
- Note page count at maintenance
- Track time between toner changes
- Predict future replacement needs

### Optimize Costs

**Right-Size Your Plan:**
- Start with Free tier if you have 1-3 printers
- Upgrade only when you need more capacity
- Monitor usage in Billing section

**Efficient Device Use:**
- One proxy can monitor entire subnet
- Don't need proxy per printer
- Use remote subnets instead of multiple devices

### Network Best Practices

**SNMP Configuration:**
- Use read-only community strings
- Avoid using "public" if possible (security)
- Document your community strings

**Firewall Rules:**
- Allow UDP port 161 (SNMP) inbound to printers
- Allow HTTPS outbound from proxy device
- No inbound ports needed on proxy

**Reliable Monitoring:**
- Use wired ethernet for proxy
- Place proxy on always-on device
- Keep proxy device physically secure

### Security Recommendations

**API Keys:**
- Store securely (password manager)
- Never share in emails/tickets
- Regenerate if compromised

**Account Security:**
- Use strong, unique password
- Enable 2FA when available *(coming soon)*
- Don't share account credentials

**Network Security:**
- Isolate printers on separate VLAN *(advanced)*
- Use SNMPv3 if printers support it *(coming soon)*
- Regular firmware updates on printers

---

## FAQ

### General Questions

**Q: How often are printers checked?**
A: Every 5 minutes by default. Configurable from 1-60 minutes.

**Q: What happens if my internet goes down?**
A: Metrics are buffered locally and uploaded when connection restores.

**Q: Can I monitor printers at different locations?**
A: Yes! Install a proxy device at each location, or use remote subnet scanning.

**Q: Do you support wireless printers?**
A: Yes, if they support SNMP and are on your network.

**Q: What if my printer IP changes?**
A: Proxy will lose connection. Either set static IP on printer or update manually.

### Technical Questions

**Q: What is SNMP?**
A: Simple Network Management Protocol - industry standard for printer monitoring.

**Q: Which SNMP version do you support?**
A: Currently SNMPv2c. SNMPv3 support coming soon.

**Q: Do you access my print jobs or documents?**
A: No! We only collect toner levels, page counts, and status. No document data.

**Q: Can I self-host the entire system?**
A: The proxy is open source and runs locally. API and dashboard are cloud-hosted.

**Q: What data do you send to your servers?**
A: Only metrics (toner %, page count, status). No print jobs, documents, or user data.

### Billing Questions

**Q: Can I cancel anytime?**
A: Yes! No contracts or cancellation fees.

**Q: What payment methods do you accept?**
A: Credit/debit cards via Stripe. PayPal coming soon.

**Q: Do you offer refunds?**
A: Contact support within 30 days for refund consideration.

**Q: What happens when trial ends?**
A: You're downgraded to Free tier unless you subscribe to a paid plan.

**Q: Can I get a discount for annual billing?**
A: Yes! Save 17% with annual billing on all plans.

### Troubleshooting

**Q: No printers showing up?**
A: Check:
1. Proxy device is running
2. Printers have SNMP enabled
3. Proxy can ping printer IPs
4. Wait 5-10 minutes for discovery

**Q: Printer shows "Disconnected"?**
A: Possible causes:
- Printer is powered off
- Network connectivity issue
- SNMP disabled on printer
- Firewall blocking port 161

**Q: Toner level stuck at 0% or 100%?**
A: Some printers don't report toner accurately via SNMP. Check printer documentation.

**Q: Historical data missing?**
A: Data retention depends on your plan:
- Free: 7 days
- Maker: 90 days
- Pro: 1 year
- Enterprise: Unlimited

**Q: Proxy keeps restarting?**
A: Check logs:
```bash
sudo journalctl -u printermonitor-proxy -n 50
```
Common issues: Invalid API key, network problems, config errors.

---

## Need More Help?

### Support Channels

- 📖 **Documentation:** [Installation Guide](installation.md) | [API Docs](api.md)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/printmonitor/printermonitor-proxy/issues)
- 💬 **Community:** [GitHub Discussions](https://github.com/printmonitor/printermonitor-pro/discussions)
- 📧 **Email Support:** support@prntr.org *(coming soon)*

### Feedback

We'd love to hear from you!
- Feature requests: GitHub Discussions
- Bug reports: GitHub Issues
- General feedback: support@prntr.org

---

## What's Next?

Explore advanced features:
- 🔔 **Email Alerts** *(coming soon)* - Get notified when toner is low
- 📱 **Mobile App** *(roadmap)* - Monitor on the go
- 🔗 **Integrations** *(roadmap)* - Slack, Teams, webhooks
- 📊 **Advanced Analytics** *(roadmap)* - ML-powered predictions

---

<div align="center">

**User Guide v1.0** • Last Updated: February 2026

[Installation Guide](installation.md) • [Main Documentation](../README.md) • [API Docs](api.md)

**Happy Monitoring!** 🖨️✨

</div>
