import json
import openai
import os
from openai import OpenAI
from dotenv import load_dotenv
from Utils.common import CommonUtils
from Services.mongo import MongoService
from bson import ObjectId

mongo = MongoService()
config = CommonUtils.get_config()
client = OpenAI(api_key=config["OPENAI_API_KEY"])

class OpenAI:

    @classmethod
    def attach_openai_campaign(cls, mongo_id, content):
        result = mongo.db.businesses.update_one(
            {"_id": ObjectId(mongo_id)},
            {"$set": {"openai": content}}
        )
        return result.modified_count

    @classmethod
    def generate_campaign(cls, data, mongo_id):
        business = data.get("business_identity", {})
        product = data.get("product_details", {})
        branding = data.get("branding_preferences", {})
        customers = data.get("customer_insights", {})

        prompt = f"""
            You are a digital marketing strategist for small businesses.
        
            Create a complete marketing campaign for the following business and product.
        
            Business:
            - Name: {business.get("business_name")}
            - Owner: {business.get("owner_name")}
            - Type: {business.get("business_type")}
            - Logo URL: {business.get("logo_url")}
        
            Product:
            - Name: {product.get("product_name")}
            - Description: {product.get("description")}
            - Target Audience: {product.get("target_audience")}
            - Price: {product.get("price")}
        
            Branding:
            - Voice: {branding.get("brand_voice")}
            - Language: {branding.get("preferred_language")}
            - Social Links: Instagram: {branding.get('social_links', {}).get('instagram')}, Facebook: {branding.get('social_links', {}).get('facebook')}, TikTok: {branding.get('social_links', {}).get('tiktok')}
        
            Customer Insights:
            - Demographics: {customers.get("demographics")}
            - Preferences: {customers.get("preferences")}
            - Testimonials: {customers.get("testimonials")}
            - FAQs: {customers.get("faqs")}
        
            💡 Structure the response in **valid JSON format** and include:
        
            1. campaign_name
            2. campaign_theme
            3. launch_strategy
            4. 3 social media captions
            5. 2 AI image prompts (for image generation)
            6. 1 short-form video script idea (reel/tiktok)
            7. engagement strategy
            8. CTA suggestions
            9. ideal posting schedule
            10. platform focus
        
            Make it fun, punchy, and tailored to the brand tone.
            """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        content = json.loads(response.choices[0].message.content)
        cls.attach_openai_campaign(mongo_id, content)
        return content  # You can wrap it with json.loads if the response is valid JSON

