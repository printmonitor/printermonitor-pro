#!/usr/bin/env python3
"""
Clear database helper script
"""

import sqlite3
import sys
import os

db_file = 'printer_monitoring.db'

if not os.path.exists(db_file):
    print(f"✓ Database {db_file} doesn't exist")
    sys.exit(0)

print("What do you want to clear?")
print("1. Everything (printers + metrics)")
print("2. Just metrics (keep printers)")
print("3. Delete entire database file")
print("4. Cancel")

choice = input("\nEnter choice (1-4): ").strip()

if choice == '1':
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM metrics')
    cursor.execute('DELETE FROM printers')
    conn.commit()
    conn.close()
    print("✓ Cleared all printers and metrics")
    
elif choice == '2':
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM metrics')
    conn.commit()
    conn.close()
    print("✓ Cleared all metrics (printers kept)")
    
elif choice == '3':
    os.remove(db_file)
    print(f"✓ Deleted {db_file}")
    
elif choice == '4':
    print("Cancelled")
    
else:
    print("Invalid choice")
    sys.exit(1)
