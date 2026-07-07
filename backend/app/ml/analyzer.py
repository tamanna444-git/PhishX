import torch
import numpy as np
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load the model and tokenizer once when the backend starts
MODEL_NAME = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(MODEL_NAME)
model = GPT2LMHeadModel.from_pretrained(MODEL_NAME)
model.eval()  # Set to evaluation mode

def calculate_metrics(text: str):
    if not text.strip() or len(text.split()) < 3:
        return {
            "ai_score": 0.0,
            "perplexity": 0.0,
            "burstiness": 0.0,
            "status": "Text too short"
        }

    # 1. Calculate Perplexity
    inputs = tokenizer(text, return_tensors="pt")
    input_ids = inputs["input_ids"]
    
    with torch.no_grad():
        outputs = model(input_ids, labels=input_ids)
        loss = outputs.loss
        perplexity = torch.exp(loss).item()

    # 2. Calculate Burstiness (Standard Deviation of Individual Sentence Perplexities)
    # Split text into sentences roughly by periods
    sentences = [s.strip() for s in text.split('.') if len(s.strip().split()) > 2]
    
    sentence_perplexities = []
    for sentence in sentences:
        s_inputs = tokenizer(sentence, return_tensors="pt")
        s_ids = s_inputs["input_ids"]
        with torch.no_grad():
            try:
                s_outputs = model(s_ids, labels=s_ids)
                sentence_perplexities.append(torch.exp(s_outputs.loss).item())
            except Exception:
                continue

    # Burstiness is the variance/standard deviation of sentence perplexity
    if len(sentence_perplexities) > 1:
        burstiness = float(np.std(sentence_perplexities) / (np.mean(sentence_perplexities) + 1e-5))
    else:
        burstiness = 0.0  # Single sentences don't have burstiness variance

    # 3. Predict AI Likelihood (Simple heuristic mapped from Perplexity/Burstiness)
    # AI text usually has low perplexity (highly predictable) and low burstiness (uniform structure)
    ai_score = 100.0
    if perplexity > 100:
        ai_score -= 40
    if burstiness > 0.5:
        ai_score -= 40
    
    ai_score = max(5.0, min(99.0, ai_score)) # Keep within 5% - 99% range

    # Determine status text matching your UI logic
    if ai_score >= 70:
        status = "Likely AI Generated"
    elif ai_score >= 40:
        status = "Possibly AI Generated"
    else:
        status = "Likely Human Written"

    return {
        "ai_score": round(ai_score, 1),
        "perplexity": round(perplexity, 2),
        "burstiness": round(min(1.0, max(0.0, burstiness)), 2), # Bound between 0 and 1 for the UI bar
        "status": status
    }