from fastapi import APIRouter
from backend.app.schemas.message_shield import (
    MessageRequest,
    MessageResponse
)
from backend.app.ml.analyzer import calculate_metrics  # This pulls in your working ML code!

router = APIRouter()


@router.post("/stream-analyze", response_model=MessageResponse)
def analyze_message(data: MessageRequest):
    """
    Receives incoming text from the frontend buffer, runs it through 
    the local GPT-2 model logic, and sends back real-time threat metrics.
    """
    # 1. Run the user's text through your analyzer.py script
    results = calculate_metrics(data.message)

    # 2. Map and return the real results structured how your Pydantic schema expects it
    return MessageResponse(
        aiLikelihood=results["ai_score"],
        perplexity=results["perplexity"],
        burstiness=results["burstiness"],
        status=results["status"]
    )