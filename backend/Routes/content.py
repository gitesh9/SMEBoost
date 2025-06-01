from fastapi import APIRouter, Request, Depends, HTTPException
from Services.openai_service import generate_caption
from Utils.clerk_auth import verify_clerk_token

router = APIRouter()

@router.post("/generate/caption")
async def create_caption(data: dict, user=Depends(verify_clerk_token)):
    caption = generate_caption(data)
    return {"result": caption}
