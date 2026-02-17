#!/usr/bin/env python3
"""
Run printer discovery and optionally register found printers
"""

import sys
sys.path.insert(0, 'src')

from discovery.scanner import scan_subnet, print_printer_report
from storage import get_storage

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Discover printers on network')
    parser.add_argument('subnet', nargs='?', default='192.168.1.0/24', 
                       help='Subnet to scan (e.g., 192.168.1.0/24)')
    parser.add_argument('--register', action='store_true',
                       help='Register found printers in database')
    parser.add_argument('--location', default='Auto-discovered',
                       help='Location to assign to discovered printers')
    
    args = parser.parse_args()
    
    print("="*80)
    print("PRINTER DISCOVERY")
    print("="*80)
    print(f"Scanning subnet: {args.subnet}")
    print()
    
    # Run discovery
    printers = scan_subnet(args.subnet, max_threads=20)
    
    # Print report
    print_printer_report(printers)
    
    # Register if requested
    if args.register and printers:
        print("\n" + "="*80)
        print("REGISTERING PRINTERS")
        print("="*80)
        
        storage = get_storage()
        
        for printer in printers:
            ip = printer['ip']
            name = printer['name'] if printer['name'] != 'Unknown' else printer['model']
            model = printer['model']
            
            result = storage.get_or_create_printer(
                ip=ip,
                name=name,
                location=args.location,
                model=model
            )
            
            if result:
                print(f"✓ Registered: {name} ({ip})")
            else:
                print(f"✗ Failed to register: {name} ({ip})")
        
        print("\n" + "="*80)
        print(f"Registration complete: {len(printers)} printers")
        print("="*80)
    
    elif printers and not args.register:
        print("\nTo register these printers, run:")
        print(f"  python run_discovery.py {args.subnet} --register --location 'Your Location'")


if __name__ == '__main__':
    main()
