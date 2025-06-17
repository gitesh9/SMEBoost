import base64
import json
import re
import requests
import threading
from openai import OpenAI
from bson import ObjectId
from Utils.common import CommonUtils
from Services.mongo import MongoService
from Models.models import ContentIn
from fastapi.responses import StreamingResponse

mongo = MongoService()
config = CommonUtils.get_config()
client = OpenAI(api_key=config["OPENAI_API_KEY"])


class OpenAIManager:

    @classmethod
    def attach_openai_data(cls, mongo_id, update):
        return mongo.db.businesses.update_one(
            {"_id": ObjectId(mongo_id)}, {"$set": update}
        )

    @classmethod
    def generate_image_from_prompt(cls, prompt: str, size="1024x1024") -> str:
        try:
            response = client.images.generate(
                model="dall-e-3", prompt=prompt, size=size, quality="standard", n=1
            )
            image_url = response.data[0].url  # Get the image URL
            img_response = requests.get(image_url)
            if img_response.status_code == 200:
                image_bytes = img_response.content
                # Now you can save or process the image bytes
                with open("generated_image.png", "wb") as f:
                    f.write(image_bytes)
            else:
                print("Failed to download image")
            return image_url, image_bytes
        except Exception as e:
            print("Image generation failed:", e)
            return None

    @classmethod
    def generate_campaign(cls, data, mongo_id):
        business = data.get("businessDetails", {})
        product = data.get("productDetails", {})

        # Build campaign prompt
        campaign_prompt = ContentIn.get_prompts(business, product)["campaign_prompt"]

        campaign_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": campaign_prompt}],
        )

        campaign_json = json.loads(campaign_response.choices[0].message.content)

        # Save campaign early and trigger background processing
        cls.attach_openai_data(mongo_id, {"openai.campaign": campaign_json})

        # Run heavy content in background
        # thread = threading.Thread(target=cls._generate_content_async, args=(product, campaign_json, business, mongo_id))
        # thread.start()

        return {
            "message": "Campaign created, content is being generated",
            "campaign": campaign_json,
        }

    # @classmethod
    # def _generate_content_async(cls, product, campaign_json, business, mongo_id):
    #     try:
    #         # 1. Instagram Posts
    #         insta_prompt = ContentIn.get_prompts(business, product, campaign_json)[
    #             "insta_prompt"
    #         ]
    #
    #         insta_response = client.chat.completions.create(
    #             model="gpt-3.5-turbo",
    #             messages=[{"role": "user", "content": insta_prompt}],
    #         )
    #         insta_posts = json.loads(insta_response.choices[0].message.content)
    #
    #         # Add images
    #         for post in insta_posts["posts"]:
    #             prompt = f"Create a realistic image for an Instagram post using this prompt: {post['image_prompt']} Caption: {post['caption']}"
    #             post["image_url"] = cls.generate_image_from_prompt(prompt)
    #
    #         cls.attach_openai_data(mongo_id, {"openai.instagram_posts": insta_posts})
    #
    #         # 2. Blog
    #         blog_prompt = f"""Write a 1000-word SEO blog post for campaign: {campaign_json['campaign_name']}"""
    #         blog_response = client.chat.completions.create(
    #             model="gpt-3.5-turbo",
    #             messages=[{"role": "user", "content": blog_prompt}],
    #         )
    #         blog_text = blog_response.choices[0].message.content
    #
    #         cls.attach_openai_data(mongo_id, {"openai.blog": blog_text})
    #
    #     except Exception as e:
    #         print("Async content generation failed:", str(e))

    @classmethod
    def stream_full_campaign_response(cls, mongo_id):
        data = mongo.db.businesses.find_one({"_id": ObjectId(mongo_id)})
        business = data.get("businessDetails", {})
        product = data.get("productDetails", {})

        def stream():
            try:
                # ▶️ Campaign Stream
                campaign_prompt = ContentIn.get_prompts(business, product)[
                    "campaign_prompt"
                ]
                yield "event: campaign\n"
                yield 'data: {"status": "generating campaign"}\n\n'
                campaign_response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": campaign_prompt}],
                    stream=True,
                )
                campaign_content = ""
                for chunk in campaign_response:
                    if chunk.choices:
                        token = chunk.choices[0].delta.content
                        if token:
                            campaign_content += token
                            # yield f"data: {json.dumps({'campaign': token})}\n\n"

                home_image_url, home_image_bytes = cls.generate_image_from_prompt(
                    "homepage_image: Provide a AI image for a visually appealing image specifically designed to be displayed at the top of the homepage. This image should represent the campaign’s core message and attract visitors."
                )
                campaign_json = json.loads(campaign_content)
                campaign_json["home_image_url"] = home_image_url
                campaign_json["home_image_file"] = base64.b64encode(
                    home_image_bytes
                ).decode("utf-8")
                yield f"data: {json.dumps({'campaign': campaign_json})}\n\n"

                # ▶️ Blog Stream
                blog_prompt = f"""Write a 1000-word SEO blog post for campaign: {campaign_json['campaign_name']}. Please include [instagram_post_1] in the content where you think an Instagram post should be embedded."""
                yield "event: blog\n"
                yield 'data: {"status": "generating blog"}\n\n'
                blog_response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": blog_prompt}],
                    stream=True,
                )
                blog_content = ""
                for chunk in blog_response:
                    if chunk.choices:
                        token = chunk.choices[0].delta.content
                        if token:
                            blog_content += token
                yield f"data: {json.dumps({'blog': blog_content})}\n\n"

                # ▶️ Instagram Posts Stream
                insta_prompt = ContentIn.get_prompts(business, product, campaign_json)[
                    "insta_prompt"
                ]
                yield "event: instagram\n"
                yield 'data: {"status": "generating instagram posts"}\n\n'
                insta_response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": insta_prompt}],
                    stream=True,
                )
                insta_content = ""
                for chunk in insta_response:
                    if chunk.choices:
                        token = chunk.choices[0].delta.content
                        if token:
                            insta_content += token
                            # yield f"data: {json.dumps({'instagram_posts': token})}\n\n"

                # Remove trailing commas before ]
                insta_content = re.sub(r",\s*}", "}", insta_content)
                # Remove trailing commas before ]
                insta_content = re.sub(r",\s*]", "]", insta_content)
                insta_posts = json.loads(insta_content)
                for post in insta_posts:
                    img_prompt = f"Create a realistic image for Instagram post: {post['image_prompt']} Caption: {post['caption']}"
                    image_url, image_bytes = cls.generate_image_from_prompt(img_prompt)
                    post["image_url"] = image_url
                    post["image_file"] = base64.b64encode(image_bytes).decode("utf-8")
                    yield f"data: {json.dumps({'instagram_posts': post})}\n\n"

                # ▶️ Final structured JSON (optional)
                final_data = {
                    "campaign": campaign_json,
                    "instagram_posts": insta_posts,
                    "blog": blog_content,
                }
                yield 'data: {"status": "Complete"}\n\n'
                cls.attach_openai_data(
                    mongo_id,
                    {
                        "openai.campaign": campaign_json,
                        "openai.blog": blog_content,
                        "openai.instagram_posts": insta_posts,
                    },
                )
            except Exception as e:
                yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

        return StreamingResponse(stream(), media_type="text/event-stream")
