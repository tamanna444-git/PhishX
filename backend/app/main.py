from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import database configuration, session helper, and models
from backend.app.database.database import Base, engine, get_db
from backend.app.models.user import DBUser 

# Cleanly import all application routing nodes (including your new dashboard router)
from backend.app.routes import url_shield, qr_shield, message_shield, email_shield, dashboard
from backend.app.routes.user import router as user_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PhishX Security Core", version="4.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount application endpoints cleanly under unified core prefixes
app.include_router(url_shield.router, prefix="/api", tags=["URL Shield"])
app.include_router(qr_shield.router, prefix="/api", tags=["QR Guard"])
app.include_router(message_shield.router, prefix="/api", tags=["Message Shield"])
app.include_router(email_shield.router, prefix="/api", tags=["Email Shield"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])  # 👈 Clean external mount point link!
app.include_router(user_router, prefix="/api/user", tags=["User Authentication"])

@app.get("/")
def read_root():
    return {"status": "Aegis Core Perimeter Online"}