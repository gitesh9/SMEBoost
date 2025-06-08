from pymongo import MongoClient
from bson.objectid import ObjectId
import json


class MongoService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoService, cls).__new__(cls)
            cls._instance._setup()
        return cls._instance

    def _setup(self):
        with open("Config/config.json") as f:
            config = json.load(f)

        self.client = MongoClient(config["MONGODB_URI"])
        self.db = self.client["sme"]
        self.contents = self.db["generated_contents"]

    def create_content(self, user_id, content_data):
        result = self.contents.insert_one({**content_data, "user_id": user_id})
        return str(result.inserted_id)

    def get_user_contents(self, user_id):
        return list(self.contents.find({"user_id": user_id}))

    def get_content_by_id(self, content_id, user_id):
        return self.contents.find_one({"_id": ObjectId(content_id), "user_id": user_id})

    def update_content(self, content_id, user_id, new_text):
        result = self.contents.update_one(
            {"_id": ObjectId(content_id), "user_id": user_id},
            {"$set": {"text": new_text}},
        )
        return result.modified_count

    def delete_content(self, content_id, user_id):
        result = self.contents.delete_one(
            {"_id": ObjectId(content_id), "user_id": user_id}
        )
        return result.deleted_count
