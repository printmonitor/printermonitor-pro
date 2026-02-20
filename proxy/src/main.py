"""
PrinterMonitor Pro - Proxy Device

Main entry point for the monitoring system
"""

import sys
import time
from datetime import datetime
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from config import config
from storage import get_storage_backend
from monitoring.monitor import PrinterMonitor


def print_banner():
    """Print startup banner"""
    print("=" * 80)
    print("PRINTERMONITOR PRO - PROXY DEVICE")
    print("=" * 80)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)


def print_config():
    """Print current configuration"""
    print("PRINTERMONITOR PRO - PROXY CONFIGURATION")
    print("=" * 80)
    print(f"Mode: {config.MONITOR_MODE}")
    print(f"SNMP Community: {config.SNMP_COMMUNITY}")
    print(f"SNMP Timeout: {config.SNMP_TIMEOUT}s")
    print(f"Monitor Interval: {config.MONITOR_INTERVAL}s")
    
    if config.MONITOR_MODE == "cloud":
        print(f"Cloud API: {config.CLOUD_API_URL}")
        print(f"API Key: {config.CLOUD_API_KEY[:10]}...")
        print(f"Local Buffering: {'Enabled' if config.CLOUD_ENABLE_BUFFER else 'Disabled'}")
    
    print("=" * 80)


def run_once():
    """Run monitoring cycle once and exit"""
    print_banner()
    print_config()
    
    # Initialize storage
    storage = get_storage_backend()
    
    # Check health
    print("Performing health check...")
    if storage.check_health():
        print("✓ Storage backend is healthy")
    else:
        print("✗ Storage backend is not healthy")
        sys.exit(1)
    
    # Get printers
    print("Getting list of printers...")
    printers = storage.get_printers()
    
    if not printers:
        print("⚠ No printers found in storage!")
        print("To add printers:")
        print("  1. Run printer discovery: python -m discovery.scanner")
        print("  2. Or manually register printers in the database/cloud")
        return
    
    print(f"✓ Found {len(printers)} printer(s) to monitor")
    
    # Create monitor and run once
    monitor = PrinterMonitor(storage)
    
    print("=" * 80)
    print("STARTING MONITORING CYCLE")
    print("=" * 80)
    
    monitor.monitor_all_printers()
    
    print("=" * 80)
    print("MONITORING CYCLE COMPLETE")
    print("=" * 80)


def run_loop():
    """Run monitoring in continuous loop"""
    print_banner()
    print_config()
    
    # Initialize storage
    storage = get_storage_backend()
    
    # Check health
    print("Performing health check...")
    if storage.check_health():
        print("✓ Storage backend is healthy")
    else:
        print("✗ Storage backend is not healthy")
        print("Will retry in 60 seconds...")
        time.sleep(60)
        return run_loop()  # Retry
    
    # Create monitor
    monitor = PrinterMonitor(storage)
    
    print("=" * 80)
    print("STARTING CONTINUOUS MONITORING")
    print(f"Monitoring interval: {config.MONITOR_INTERVAL} seconds")
    print("Press Ctrl+C to stop")
    print("=" * 80)
    
    cycle_count = 0
    
    try:
        while True:
            cycle_count += 1
            
            # Get current printer list (may change over time)
            printers = storage.get_printers()
            
            if printers:
                print(f"\n[Cycle {cycle_count}] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"Monitoring {len(printers)} printer(s)...")
                monitor.monitor_all_printers()
                print("✓ Cycle complete")
            else:
                print(f"\n[Cycle {cycle_count}] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print("⏸  No printers registered yet. Waiting...")
                print("   Printers will be monitored automatically once registered.")
            
            # Wait for next cycle
            print(f"Next check in {config.MONITOR_INTERVAL} seconds...\n")
            time.sleep(config.MONITOR_INTERVAL)
            
    except KeyboardInterrupt:
        print("\n\n" + "=" * 80)
        print("MONITORING STOPPED")
        print("=" * 80)
        print(f"Completed {cycle_count} monitoring cycles")
        print("Goodbye!")
        sys.exit(0)


if __name__ == "__main__":
    # Get command from arguments
    command = sys.argv[1] if len(sys.argv) > 1 else "once"
    
    if command == "loop":
        run_loop()
    elif command == "once":
        run_once()
    else:
        print("Usage: python main.py [once|loop]")
        print("  once - Run monitoring once and exit")
        print("  loop - Run monitoring continuously")
        sys.exit(1)
