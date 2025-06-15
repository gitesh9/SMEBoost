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
            {"_id": ObjectId(mongo_id)}, {"$set": {"openai": content}}
        )
        return result.modified_count

    @classmethod
    def generate_image_from_prompt(cls, prompt: str, size="1024x1024") -> str:
        response = client.images.generate(
            model="dall-e-3", prompt=prompt, size=size, quality="standard", n=1
        )
        return response.data[0].url  # This is the direct image URL

    @classmethod
    def generate_campaign(cls, data, mongo_id):
        business = data.get("businessDetails", {})
        product = data.get("productDetails", {})

        # STEP 1: Generate core campaign plan
        campaign_prompt = f"""
        You are a digital marketing strategist for small businesses.

        Create a complete marketing campaign in JSON for:
        - Product: {product.get("name")}
        - Description: {product.get("description")}
        - Target Audience: {product.get("targetAudience")}
        - Business Name: {business.get("name")}

        Include:
        1. campaign_name
        2. campaign_theme
        3. launch_strategy
        4. 3 social media captions
        5. 2 AI image prompts
        6. 1 short-form video script idea
        7. engagement strategy
        8. CTA suggestions
        9. posting schedule
        10. platform focus

        Respond in valid JSON only.
        """

        campaign_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": campaign_prompt}],
        )

        campaign_json = json.loads(campaign_response.choices[0].message.content)

        # Save to Mongo
        cls.attach_openai_campaign(mongo_id, campaign_json)

        # STEP 2: Generate Instagram Posts (text + image prompts)
        insta_prompt = f"""
        Based on this campaign theme: "{campaign_json['campaign_theme']}", 
        And on this campaign name: "{campaign_json['campaign_name']}",
        And on this Launch Strategy: "{campaign_json['launch_strategy']}",
        And on this CTA Suggestions: "{campaign_json['CTA_suggestions']}",
        And on this Engagement Strategy: "{campaign_json['engagement_strategy']}",
        And on this business name: "{business['name']}",
        generate 5 Instagram posts.

        For each post, include:
        - caption
        - hashtags
        - image prompt (for AI image generation)
        Return a list of 5 posts in JSON format.
        """

        insta_response = client.chat.completions.create(
            model="gpt-3.5-turbo", messages=[{"role": "user", "content": insta_prompt}]
        )

        insta_posts = json.loads(insta_response.choices[0].message.content)

        for post in insta_posts:
            prompt = (
                "Create a realistic image for an instagram post using this prompt:"
                + post["image_prompt"]
                + "This is the post caption:"
                + post["caption"]
            )
            image_url = cls.generate_image_from_prompt(prompt)
            post["image_url"] = image_url  # Add actual image to your result

        # STEP 3: Generate Blog Post
        blog_prompt = f"""
        Write a 500-word blog post introducing the campaign: "{campaign_json['campaign_name']}" by {business.get("name")}.

        Highlight:
        - The product
        - Brand story
        - Campaign goals
        - CTA
        Make it engaging and SEO-friendly.
        """

        blog_response = client.chat.completions.create(
            model="gpt-3.5-turbo", messages=[{"role": "user", "content": blog_prompt}]
        )

        blog_text = blog_response.choices[0].message.content

        # STEP 4: Save all data into nested Mongo structure
        mongo.db.businesses.update_one(
            {"_id": ObjectId(mongo_id)},
            {
                "$set": {
                    "openai": {
                        "campaign": campaign_json,
                        "instagram_posts": insta_posts,
                        "blog": blog_text,
                    }
                }
            },
        )

        return {
            "campaign": campaign_json,
            "instagram_posts": insta_posts,
            "blog": blog_text,
        }
