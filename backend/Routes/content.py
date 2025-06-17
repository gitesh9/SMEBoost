from fastapi import APIRouter, Depends, HTTPException, Body, Request
from Models.models import ContentIn
from Utils.clerk_auth import verify_clerk_token
from Services.mongo import MongoService
from pydantic import BaseModel
from typing import Optional, Dict
from Services.openai_service import OpenAIManager
from bson.objectid import ObjectId

router = APIRouter()
mongo = MongoService()


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

    def has_instagram_posts(mongo_id):
        result = mongo.db.businesses.find_one(
            {"_id": ObjectId(mongo_id), "openai.instagram_posts": {"$exists": True}},
            {"_id": 0, "openai.instagram_posts": 1},
        )
        return result is not None

    if has_instagram_posts(mongo_id):
        result = mongo.db.businesses.find_one(
            {"_id": ObjectId(mongo_id)}, {"_id": 0, "openai": 1}
        )["openai"]
        status = "exists"
    else:
        result = OpenAIManager.generate_campaign(raw, mongo_id)
        status = "streamline"
    return {"status": status, "id": str(mongo_id), "result": result}


@router.get("/stream/{id}")
def stream_campaign(id: str):
    return OpenAIManager.stream_full_campaign_response(id)
