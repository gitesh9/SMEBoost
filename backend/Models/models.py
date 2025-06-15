from pydantic import BaseModel
from typing import Optional


class ContentIn(BaseModel):
    content_type: str
    text: str
    business_name: Optional[str] = None
    # business: Optional[str] = None
    # campaign_json = {}
    # product = {}

    @classmethod
    def get_prompts(cls, business, product, campaign_json=None):
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
        if not campaign_json:
            return {
                "campaign_prompt": campaign_prompt,
            }
        insta_prompt = f"""
                            Based on this campaign theme: "{campaign_json['campaign_theme']}", 
                            And on this campaign name: "{campaign_json['campaign_name']}",
                            And on this Launch Strategy: "{campaign_json['launch_strategy']}",
                            And on this CTA Suggestions: "{campaign_json['CTA_suggestions']}",
                            And on this Engagement Strategy: "{campaign_json['engagement_strategy']}",
                            And on this business name: "{business['name']}",
                            generate 4 Instagram posts.
    
                            For each post, include:
                            - caption
                            - hashtags
                            - image prompt (for AI image generation)
                            Return a list of 5 posts in JSON format.
                            """

        return {
            "insta_prompt": insta_prompt,
            "campaign_prompt": campaign_prompt,
        }


class ContentOut(ContentIn):
    id: str
    user_id: str
