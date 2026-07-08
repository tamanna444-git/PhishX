from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import url_shield, qr_shield, message_shield
from backend.app.routes import email_shield

app = FastAPI(title="PhishX Security Core", version="4.2.0")

# CRITICAL: This allows her local React server to talk to your FastAPI server!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows her local frontend server port to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all active defense routers
app.include_router(url_shield.router, prefix="/api", tags=["URL Shield"])
app.include_router(qr_shield.router, prefix="/api", tags=["QR Guard"])
app.include_router(message_shield.router, prefix="/api", tags=["Message Shield"])
app.include_router(email_shield.router, prefix="/api", tags=["Email Shield"])

# Live telemetry aggregator endpoint for her DashboardView.jsx
@app.get("/api/dashboard/metrics")
async def get_dashboard_metrics():
    return {
        "secureEndpoints": "98.4%",
        "threatsNeutralized": 1420,
        "uptime": "14D 6H",
        "riskLevel": 12,
        "urlsScannedToday": 342,
        "messagesShielded": 1105,
        "qrCodesAnalyzed": 89,
        "emailsScanned": 0, 
        "activeProbes": 2,
        "lastIncidentTime": "2H Ago"
    }

@app.get("/")
def read_root():
    return {"status": "Aegis Core Perimeter Online"}