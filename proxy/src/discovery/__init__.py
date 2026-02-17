"""
Discovery Package

Network printer discovery via SNMP
"""

# Make scanner functions available
try:
    from .scanner import scan_subnet, print_printer_report
    __all__ = ['scan_subnet', 'print_printer_report']
except ImportError:
    # Scanner not yet available
    pass
