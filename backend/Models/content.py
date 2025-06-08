from pydantic import BaseModel
from typing import Optional


class ContentIn(BaseModel):
    content_type: str
    text: str
    business_name: Optional[str] = None


class ContentOut(ContentIn):
    id: str
    user_id: str
