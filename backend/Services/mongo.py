from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGODB_URI"))
db = client.sme

contents = db.generated_contents

def create_content(user_id, content_data):
    result = contents.insert_one({**content_data, "user_id": user_id})
    return str(result.inserted_id)

def get_user_contents(user_id):
    return list(contents.find({"user_id": user_id}))

def get_content_by_id(content_id, user_id):
    return contents.find_one({"_id": ObjectId(content_id), "user_id": user_id})

def update_content(content_id, user_id, new_text):
    result = contents.update_one(
        {"_id": ObjectId(content_id), "user_id": user_id},
        {"$set": {"text": new_text}}
    )
    return result.modified_count

def delete_content(content_id, user_id):
    result = contents.delete_one({"_id": ObjectId(content_id), "user_id": user_id})
    return result.deleted_count
