from fastapi import Header, HTTPException
from jose import jwt
import requests
import os

issuer = os.getenv("CLERK_JWT_ISSUER")


def get_jwks():
    return requests.get(f"{issuer}/.well-known/jwks.json").json()


def verify_clerk_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = authorization.split(" ")[1]
    jwks = get_jwks()

    try:
        for key in jwks["keys"]:
            try:
                decoded = jwt.decode(
                    token, key=key, algorithms=["RS256"], audience=None, issuer=issuer
                )
                return decoded
            except Exception:
                continue
        raise HTTPException(status_code=401, detail="Invalid token")
    except:
        raise HTTPException(status_code=401, detail="Invalid Clerk token")
