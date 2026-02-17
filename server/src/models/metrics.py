"""
Printer Metrics Model

Time-series data for printer metrics (toner, pages, etc.)
This will be converted to a TimescaleDB hypertable
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class PrinterMetrics(Base):
    __tablename__ = "printer_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    printer_id = Column(Integer, ForeignKey("printers.id"), nullable=False, index=True)
    
    # Timestamp (will be the time column for TimescaleDB hypertable)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Page counts
    total_pages = Column(Integer, nullable=True)
    
    # Toner/Ink levels
    toner_level_pct = Column(Integer, nullable=True)  # Percentage 0-100
    toner_status = Column(String, nullable=True)  # OK, Low, Empty, Unknown
    
    # Drum
    drum_level_pct = Column(Integer, nullable=True)
    
    # Device status
    device_status = Column(Integer, nullable=True)  # SNMP device status code
    
    # Model info (can change if printer replaced at same IP)
    model = Column(String, nullable=True)
    
    # Additional data (JSON-like storage for flexible metrics)
    additional_data = Column(Text, nullable=True)
    
    # Relationships
    printer = relationship("Printer", back_populates="metrics")
    
    def __repr__(self):
        return f"<PrinterMetrics printer_id={self.printer_id} at {self.timestamp}>"


# Note: After creating the table, we'll convert it to a TimescaleDB hypertable
# with this SQL:
# SELECT create_hypertable('printer_metrics', 'timestamp', if_not_exists => TRUE);
