from fastapi import FastAPI
from Routes import content
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(content.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
