from fastapi import APIRouter
from backend.app.schemas.message_shield import (
    MessageRequest,
    MessageResponse
)

router = APIRouter()


@router.post("/stream-analyze", response_model=MessageResponse)
def analyze_message(data: MessageRequest):

    # Temporary dummy values
    ai_score = 32.5
    perplexity = 18.7
    burstiness = 0.61

    if ai_score >= 70:
        status = "Likely AI Generated"
    elif ai_score >= 40:
        status = "Possibly AI Generated"
    else:
        status = "Likely Human Written"

    return MessageResponse(
        aiLikelihood=ai_score,
        perplexity=perplexity,
        burstiness=burstiness,
        status=status
    )