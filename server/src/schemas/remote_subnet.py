"""
Remote Subnet Schemas
"""

from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
import ipaddress


class RemoteSubnetCreate(BaseModel):
    subnet: str
    description: Optional[str] = None
    device_id: Optional[int] = None
    
    @field_validator('subnet')
    def validate_subnet(cls, v):
        try:
            ipaddress.ip_network(v)
            return v
        except ValueError:
            raise ValueError('Invalid subnet format. Use CIDR notation (e.g., 192.168.1.0/24)')


class RemoteSubnetResponse(BaseModel):
    id: int
    subnet: str
    description: Optional[str]
    device_id: Optional[int]
    enabled: bool
    created_at: datetime
    last_scanned_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class RemoteSubnetUpdate(BaseModel):
    description: Optional[str] = None
    enabled: Optional[bool] = None
    device_id: Optional[int] = None
