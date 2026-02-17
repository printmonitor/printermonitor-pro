"""
Proxy Device Model

Represents proxy devices (Raspberry Pi, servers) that monitor printers
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import secrets

from ..database import Base


class ProxyDevice(Base):
    __tablename__ = "proxy_devices"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Device identification
    name = Column(String, nullable=False)
    api_key = Column(String, unique=True, index=True, nullable=False)
    hardware_id = Column(String, unique=True, nullable=True)  # MAC address, UUID, etc.
    
    # Device info
    version = Column(String)  # Proxy software version
    status = Column(String, default="active")  # active, inactive, suspended
    
    # Connection tracking
    last_seen_at = Column(DateTime, nullable=True)
    ip_address = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Device metadata (renamed from 'metadata' to avoid SQLAlchemy conflict)
    device_metadata = Column(Text, nullable=True)  # Store as JSON string
    
    # Relationships
    owner = relationship("User", back_populates="devices")
    printers = relationship("Printer", back_populates="device", cascade="all, delete-orphan")
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate a secure API key"""
        return f"pm_device_{secrets.token_urlsafe(32)}"
    
    def __repr__(self):
        return f"<ProxyDevice {self.name} ({self.id})>"
