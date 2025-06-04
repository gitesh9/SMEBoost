import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def generate_caption(data):
    prompt = f"Create a catchy Instagram caption for this product: {data['product']} targeting {data['audience']}. Use tone: {data['tone']}."

    response = openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": prompt}]
    )

    return response["choices"][0]["message"]["content"]
