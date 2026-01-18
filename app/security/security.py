import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt

# 1. Configuration - In a real app, move these to a .env file
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-hex-string")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Creates a signed JWT access token.
    :param data: A dictionary containing the 'sub' (subject), usually the user's email.
    :param expires_delta: Optional custom expiration time.
    """
    to_encode = data.copy()

    # 2. Set Expiration Time
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # 3. Update the payload with the 'exp' (expiration) claim
    to_encode.update({"exp": expire})

    # 4. Encode and sign the JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt