"""
Printer Model

Represents individual printers monitored by proxy devices
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class Printer(Base):
    __tablename__ = "printers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("proxy_devices.id"), nullable=False)
    
    # Printer identification
    ip = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    model = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    serial_number = Column(String, nullable=True)
    
    # Current status
    connection_status = Column(String, default="unknown")  # connected, disconnected, error
    last_seen_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Printer metadata (renamed from 'metadata' to avoid SQLAlchemy conflict)
    printer_metadata = Column(Text, nullable=True)
    
    # Relationships
    owner = relationship("User", back_populates="printers")
    device = relationship("ProxyDevice", back_populates="printers")
    metrics = relationship("PrinterMetrics", back_populates="printer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Printer {self.name} ({self.ip})>"
