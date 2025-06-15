from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes import content

app = FastAPI()

# CORS (adjust if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(content.router, prefix="/api")
