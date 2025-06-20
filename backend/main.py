import logging
import uvicorn
import os


if __name__ == "__main__":
    # uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
    port = int(os.environ.get("PORT", 8080))  # Fallback for local
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)

