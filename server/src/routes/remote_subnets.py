"""
Remote Subnet Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User, RemoteSubnet
from ..schemas.remote_subnet import RemoteSubnetCreate, RemoteSubnetResponse, RemoteSubnetUpdate
from ..auth.dependencies import get_current_user

router = APIRouter()


@router.get("", response_model=List[RemoteSubnetResponse])
def list_remote_subnets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all remote subnets for the current user"""
    subnets = db.query(RemoteSubnet).filter(
        RemoteSubnet.user_id == current_user.id
    ).all()
    
    return subnets


@router.post("", response_model=RemoteSubnetResponse, status_code=status.HTTP_201_CREATED)
def create_remote_subnet(
    subnet_data: RemoteSubnetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a new remote subnet to scan"""
    
    # Check if subnet already exists for this user
    existing = db.query(RemoteSubnet).filter(
        RemoteSubnet.user_id == current_user.id,
        RemoteSubnet.subnet == subnet_data.subnet
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This subnet is already registered"
        )
    
    subnet = RemoteSubnet(
        user_id=current_user.id,
        subnet=subnet_data.subnet,
        description=subnet_data.description,
        device_id=subnet_data.device_id,
        enabled=True
    )
    
    db.add(subnet)
    db.commit()
    db.refresh(subnet)
    
    print(f"✓ Remote subnet added: {subnet.subnet} by {current_user.email}")
    
    return subnet


@router.patch("/{subnet_id}", response_model=RemoteSubnetResponse)
def update_remote_subnet(
    subnet_id: int,
    subnet_update: RemoteSubnetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a remote subnet"""
    
    subnet = db.query(RemoteSubnet).filter(
        RemoteSubnet.id == subnet_id,
        RemoteSubnet.user_id == current_user.id
    ).first()
    
    if not subnet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subnet not found"
        )
    
    if subnet_update.description is not None:
        subnet.description = subnet_update.description
    if subnet_update.enabled is not None:
        subnet.enabled = subnet_update.enabled
    if subnet_update.device_id is not None:
        subnet.device_id = subnet_update.device_id
    
    db.commit()
    db.refresh(subnet)
    
    return subnet


@router.delete("/{subnet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_remote_subnet(
    subnet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a remote subnet"""
    
    subnet = db.query(RemoteSubnet).filter(
        RemoteSubnet.id == subnet_id,
        RemoteSubnet.user_id == current_user.id
    ).first()
    
    if not subnet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subnet not found"
        )
    
    db.delete(subnet)
    db.commit()
    
    print(f"✓ Remote subnet deleted: {subnet.subnet}")
    
    return None
