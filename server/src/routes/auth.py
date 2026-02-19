"""
Authentication Routes

User registration, login, and profile endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserResponse, Token, LoginRequest
from ..auth import hash_password, verify_password, create_access_token
from ..auth.dependencies import get_current_user
from ..config import settings
from ..utils.license_service import LicenseService

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account
    Automatically assigns Free tier with 14-day Pro trial
    """
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name,
        is_active=True,
        is_verified=False
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    license = LicenseService.create_free_license(db, user)
    
    print(f"✓ New user registered: {user.email}")
    print(f"  → Assigned Free license with 14-day Pro trial")
    print(f"  → Trial ends: {license.trial_ends_at}")
    
    return user


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password, returns JWT token
    """
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    user.last_login_at = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    print(f"✓ User logged in: {user.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get current user profile with license info
    """
    # Refresh to ensure license is loaded
    db.refresh(current_user)
    
    response = {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at,
        "last_login_at": current_user.last_login_at,
    }
    
    # Add license info if exists
    if current_user.license:
        response["license"] = {
            "tier_id": current_user.license.tier_id,
            "status": current_user.license.status,
            "trial_ends_at": current_user.license.trial_ends_at,
            "expires_at": current_user.license.expires_at,
        }
    
    return response


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout current user
    """
    return {"message": "Successfully logged out"}
