"""
Remote Subnet Model
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class RemoteSubnet(Base):
    __tablename__ = "remote_subnets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("proxy_devices.id"), nullable=True)
    
    subnet = Column(String, nullable=False)
    description = Column(String)
    enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    last_scanned_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<RemoteSubnet {self.subnet}>"
