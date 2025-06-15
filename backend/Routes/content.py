from fastapi import APIRouter, Depends, HTTPException, Body, Request
from Models.models import ContentIn
from Utils.clerk_auth import verify_clerk_token
from Services.mongo import MongoService
from pydantic import BaseModel
from typing import Optional, Dict
from Services.openai_service import OpenAI
from bson.objectid import ObjectId

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

    business_name = raw.get("businessDetails", {}).get("name")
    raw["businessDetails"]["owner_name"] = (
        raw.get("businessDetails", {}).get("name")
        if "owner_name" not in raw.get("businessDetails", {}).keys()
        else raw.get("businessDetails", {}).get("owner_name")
    )
    owner_name = raw.get("businessDetails", {}).get("owner_name")

    if not business_name or not owner_name:
        return {"error": "Missing business_name or owner_name"}

    query = {
        "businessDetails.name": business_name,
        "businessDetails.owner_name": owner_name,
    }

    existing = mongo.db.businesses.find_one(query)

    if existing:
        mongo.db.businesses.update_one({"_id": existing["_id"]}, {"$set": raw})
        mongo_id = existing["_id"]
    else:
        inserted_id = mongo.db.businesses.insert_one(raw).inserted_id
        mongo_id = inserted_id

    def has_openai_content(mongo_id):
        result = mongo.db.businesses.find_one(
            {"_id": ObjectId(mongo_id), "openai": {"$exists": True}}
        )
        return result is not None

    if has_openai_content(mongo_id):
        result = mongo.db.businesses.find_one(
            {"_id": ObjectId(mongo_id)}, {"_id": 0, "openai": 1}
        )["openai"]
    else:
        result = OpenAI.generate_campaign(raw, mongo_id)
    return {"status": "updated", "id": str(mongo_id), "result": result}
