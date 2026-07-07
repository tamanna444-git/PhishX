from pydantic import BaseModel

class MessageRequest(BaseModel):
    message: str


class MessageResponse(BaseModel):
    aiLikelihood: float
    perplexity: float
    burstiness: float
    status: str