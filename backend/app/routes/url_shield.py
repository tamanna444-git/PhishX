import joblib
import whois
import ssl
import socket
import re
from urllib.parse import urlparse
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd

router = APIRouter()

# Load the model from your backend models directory
MODEL_PATH = "backend/app/models/best_phishing_model.pkl"
model = joblib.load(MODEL_PATH)

class URLRequest(BaseModel):
    url: str

def extract_features(url: str):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower()
    if not domain:
        parsed_url = urlparse(f"http://{url}")
        domain = parsed_url.netloc.lower()

    # Feature 1 & 2: Lengths
    url_length = len(url)
    domain_length = len(domain)
    
    # Features 3 to 9: Character Counts
    no_of_dots = url.count('.')
    no_of_digits = sum(c.isdigit() for c in url)
    no_of_hyphen = url.count('-')
    no_of_slash = url.count('/')
    no_of_question = url.count('?')
    no_of_equal = url.count('=')
    no_of_at = url.count('@')
    
    # Feature 10: HTTPS Check (1 if https, 0 otherwise)
    https_status = 1 if url.lower().startswith("https") else 0
    
    # Feature 11: Has IP Check (Checks if domain is a raw IPv4 address)
    ip_pattern = r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$"
    has_ip = 1 if re.match(ip_pattern, domain) else 0

    # Create DataFrame structure matching exactly what the model expects
    features_df = pd.DataFrame([{
        'URLLength': url_length,
        'DomainLength': domain_length,
        'NoOfDots': no_of_dots,
        'NoOfDigits': no_of_digits,
        'NoOfHyphen': no_of_hyphen,
        'NoOfSlash': no_of_slash,
        'NoOfQuestion': no_of_question,
        'NoOfEqual': no_of_equal,
        'NoOfAt': no_of_at,
        'HTTPS': https_status,
        'HasIP': has_ip
    }])
    return features_df, domain

# Change from: @router.post("/url-analyze")
@router.post("/url-analyze") # Keep this if she hits url-analyze, or change to "/analyze" to match her URL scanner code exactly. Let's make sure it matches whatever her code hits!
def analyze_url(data: URLRequest):
    url = data.url
    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")

    try:
        features, domain = extract_features(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Feature extraction failed: {str(e)}")

    # Run Machine Learning Prediction
    prediction = int(model.predict(features)[0])
    
    try:
        probabilities = model.predict_proba(features)[0]
        confidence = float(max(probabilities) * 100)
    except:
        confidence = 100.0

    # CORRECTED MAPPING: 0 = Phishing, 1 = Safe
    if prediction == 0:
        ml_result = "Phishing"
        recommendation = "High risk detected by AI. Avoid interacting with this site."
    else:
        ml_result = "Safe"
        recommendation = "The AI model classifies this website as safe."

    return {
        "domain": domain,
        "ai_prediction": ml_result,
        "confidence_percentage": round(confidence, 2),
        "recommendation": recommendation
    }