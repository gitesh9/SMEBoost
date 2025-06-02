from fastapi import APIRouter, Depends, HTTPException, Body
from Models.content import ContentIn
from Services.mongo import MongoService
from Utils.clerk_auth import verify_clerk_token

router = APIRouter()
mongo = MongoService()

@router.post("/content")
def create(content: ContentIn, user=Depends(verify_clerk_token)):
    content_id = mongo.create_content(user_id=user['sub'], content_data=content.dict())
    return {"message": "Content created", "id": content_id}

@router.get("/content")
def read_all(user=Depends(verify_clerk_token)):
    user_content = mongo.get_user_contents(user['sub'])
    for item in user_content:
        item['id'] = str(item['_id'])
        del item['_id']
    return user_content

@router.get("/content/{content_id}")
def read_one(content_id: str, user=Depends(verify_clerk_token)):
    content = mongo.get_content_by_id(content_id, user['sub'])
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    content['id'] = str(content['_id'])
    del content['_id']
    return content

@router.put("/content/{content_id}")
def update(content_id: str, update: dict = Body(...), user=Depends(verify_clerk_token)):
    modified = mongo.update_content(content_id, user['sub'], update.get("text"))
    if not modified:
        raise HTTPException(status_code=404, detail="Update failed or not found")
    return {"message": "Content updated"}

@router.delete("/content/{content_id}")
def delete(content_id: str, user=Depends(verify_clerk_token)):
    deleted = mongo.delete_content(content_id, user['sub'])
    if not deleted:
        raise HTTPException(status_code=404, detail="Content not found or already deleted")
    return {"message": "Content deleted"}
