from fastapi import APIRouter, Depends, HTTPException, Body, Request
from Models.models import ContentIn
from Utils.clerk_auth import verify_clerk_token
from Services.mongo import MongoService
from pydantic import BaseModel
from typing import Optional, Dict
from Services.openai_service import OpenAI

router = APIRouter()
mongo = MongoService()

# Pydantic Models
class FormRequest(BaseModel):
    business_identity: Dict[str, str]
    product_details: Dict[str, str]
    branding_preferences: Dict[str, Optional[Dict[str, str]]]
    customer_insights: Dict[str, Optional[str]]

# @router.post("/form")
# def submit_form(payload: FormRequest, user=Depends(verify_clerk_token)):
#     doc = payload.dict()
#     doc["user_id"] = user["sub"]
#     form_id = mongo.db.submissions.insert_one(doc).inserted_id
#     return {"message": "Form submitted", "id": str(form_id)}

@router.post("/form")
async def submit_form(request: Request):
    raw = await request.json()

    business_name = raw.get("business_identity", {}).get("business_name")
    owner_name = raw.get("business_identity", {}).get("owner_name")

    if not business_name or not owner_name:
        return {"error": "Missing business_name or owner_name"}

    query = {
        "business_identity.business_name": business_name,
        "business_identity.owner_name": owner_name
    }

    existing = mongo.db.businesses.find_one(query)

    if existing:
        mongo.db.businesses.update_one(
            {"_id": existing["_id"]},
            {"$set": raw}
        )
        result = OpenAI.generate_campaign(raw, existing["_id"])
        return {
            "status": "updated",
            "id": str(existing["_id"]),
            "result": result
        }
    else:
        inserted_id = mongo.db.businesses.insert_one(raw).inserted_id
        result = OpenAI.generate_campaign(raw, inserted_id)
        return {
            "status": "inserted",
            "id": str(inserted_id),
            "result": result
        }


