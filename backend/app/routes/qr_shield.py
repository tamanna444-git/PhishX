import cv2
import numpy as np
import re
import joblib
import validators
from fastapi import APIRouter, UploadFile, File, HTTPException
from pyzbar.pyzbar import decode
from urllib.parse import urlparse
import pandas as pd

router = APIRouter()

# Load the existing Random Forest URL model
MODEL_PATH = "backend/app/models/best_phishing_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load machine learning model from {MODEL_PATH}: {str(e)}")

# Reusable URL Feature Extractor (Matches your exact model inputs)
def extract_url_features(url: str):
    domain = urlparse(url).netloc
    features = {
        "URLLength": len(url),
        "DomainLength": len(domain),
        "NoOfDots": url.count("."),
        "NoOfDigits": sum(c.isdigit() for c in url),
        "NoOfHyphen": url.count("-"),
        "NoOfSlash": url.count("/"),
        "NoOfQuestion": url.count("?"),
        "NoOfEqual": url.count("="),
        "NoOfAt": url.count("@"),
        "HTTPS": 1 if url.startswith("https") else 0,
        "HasIP": 1 if re.search(r"\d+\.\d+\.\d+\.\d+", url) else 0
    }
    return pd.DataFrame([features])

# The Live QR Scan API Endpoint
@router.post("/qr-analyze")
async def analyze_qr_code(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image format (PNG/JPG).")
    
    try:
        # Read file stream bytes cleanly into memory
        file_bytes = await file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data. Unable to parse matrix.")
        
        # Decode the matrix barcode array using PyZbar
        decoded_objects = decode(image)
        if not decoded_objects:
            return {
                "success": False,
                "message": "No functional QR code matrix detected in this graphic."
            }
        
        # Pull raw content out of the first detected matrix code
        qr_text = decoded_objects[0].data.decode("utf-8")
        
        # Check if the text inside the QR code is a web address link
        is_url = bool(validators.url(qr_text))
        if not is_url:
            return {
                "success": True,
                "is_url": False,
                "content": qr_text,
                "prediction": "Safe",
                "risk_score": 0,
                "recommendation": "This QR code contains text or raw data instead of an external link. Proceed with caution."
            }
            
        # If it is a web link, isolate features and push into Random Forest model!
        features_df = extract_url_features(qr_text)
        prediction = model.predict(features_df)[0]
        probabilities = model.predict_proba(features_df)[0]
        
        phishing_probability = probabilities[1] * 100
        verdict = "Phishing" if prediction == 1 else "Safe"
        
        return {
            "success": True,
            "is_url": True,
            "domain": urlparse(qr_text).netloc,
            "content": qr_text,
            "prediction": verdict,
            "confidence_percentage": round(probabilities[1] * 100 if prediction == 1 else probabilities[0] * 100, 2),
            "risk_score": round(phishing_probability),
            "recommendation": "CRITICAL: Do not open this link. The ML model identifies structural phishing characteristics." if verdict == "Phishing" else "The target link shows normal parameters and matches a safe rating profile."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Image Processing Failure: {str(e)}")