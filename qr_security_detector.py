# ==========================================================
# INSTALL REQUIRED LIBRARIES
# ==========================================================

!pip install -q opencv-python pyzbar validators
!apt-get -qq install -y libzbar0

# ==========================================================
# IMPORT LIBRARIES
# ==========================================================

import cv2
import validators
from pyzbar.pyzbar import decode

# ==========================================================
# QR DETECTOR CLASS
# ==========================================================

class QRSecurityDetector:

    def __init__(self):
        pass

    # ------------------------------------------------------
    # Read Image
    # ------------------------------------------------------
    def load_image(self, image_path):

        image = cv2.imread(image_path)

        if image is None:
            raise Exception("Unable to load image.")

        return image


    # ------------------------------------------------------
    # Detect QR Code
    # ------------------------------------------------------
    def detect_qr(self, image):

        decoded_objects = decode(image)

        if len(decoded_objects) == 0:

            return None

        return decoded_objects[0]


    # ------------------------------------------------------
    # Extract URL
    # ------------------------------------------------------
    def extract_url(self, qr_object):

        qr_text = qr_object.data.decode("utf-8")

        return qr_text


    # ------------------------------------------------------
    # Validate URL
    # ------------------------------------------------------
    def is_valid_url(self, text):

        return validators.url(text)


# ==========================================================
# TEST
# ==========================================================

detector = QRSecurityDetector()

print("Part 1 Loaded Successfully")

from google.colab import files

uploaded = files.upload()

image_name = list(uploaded.keys())[0]

image = detector.load_image(image_name)

qr = detector.detect_qr(image)

if qr is None:

    print("No QR Code Found")

else:

    url = detector.extract_url(qr)
    print("QR Content:", repr(url))
    print("Valid URL :", detector.is_valid_url(url))

# ==========================================================
# FEATURE EXTRACTION
# ==========================================================

from urllib.parse import urlparse
import pandas as pd
import re

class URLFeatureExtractor:

    def __init__(self):
        pass

    def extract_features(self, url):

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


feature_extractor = URLFeatureExtractor()

print("Feature Extractor Loaded Successfully")

url = "https://www.google.com/search?q=chatgpt"

features = feature_extractor.extract_features(url)

print(features)

# ==========================================================
# LOAD TRAINED MODEL
# ==========================================================

import joblib
import numpy as np

model = joblib.load("best_phishing_model.pkl")

print("Phishing Model Loaded Successfully")

# ==========================================================
# QR SECURITY ANALYZER
# ==========================================================

class QRSecurityAnalyzer:

    def __init__(self, model):
        self.model = model

    def analyze(self, image_path):

        # -------------------------------
        # Load Image
        # -------------------------------
        image = detector.load_image(image_path)

        # -------------------------------
        # Detect QR
        # -------------------------------
        qr = detector.detect_qr(image)

        if qr is None:

            return {

                "success": False,

                "message": "No QR Code Found"

            }

        # -------------------------------
        # Extract URL
        # -------------------------------
        url = detector.extract_url(qr)

        if not detector.is_valid_url(url):

            return {

                "success": False,

                "message": "QR Code does not contain a valid URL.",

                "content": url

            }

        # -------------------------------
        # Feature Extraction
        # -------------------------------
        features = feature_extractor.extract_features(url)

        # -------------------------------
        # Prediction
        # -------------------------------
        prediction = self.model.predict(features)[0]

        probability = self.model.predict_proba(features)[0]

        phishing_probability = probability[1] * 100

        safe_probability = probability[0] * 100

        # -------------------------------
        # Risk Score
        # -------------------------------
        risk_score = round(phishing_probability)

        # -------------------------------
        # Result
        # -------------------------------
        return {

            "success": True,

            "url": url,

            "prediction":
                "Phishing"
                if prediction == 1
                else "Safe",

            "phishing_probability":
                round(phishing_probability,2),

            "safe_probability":
                round(safe_probability,2),

            "risk_score":
                risk_score

        }


analyzer = QRSecurityAnalyzer(model)

print("QR Security Analyzer Ready")

from google.colab import files

uploaded = files.upload()

image_name = list(uploaded.keys())[0]

result = analyzer.analyze(image_name)

print("\n")

print("="*60)

if result["success"]:

    print("QR SECURITY REPORT")

    print("="*60)

    print("URL                :", result["url"])

    print("Prediction         :", result["prediction"])

    print("Phishing Chance    :", f"{result['phishing_probability']:.2f}%")

    print("Safe Chance        :", f"{result['safe_probability']:.2f}%")

    print("Risk Score         :", f"{result['risk_score']}/100")

else:

    print(result["message"])

print("="*60)
%%writefile qr_security_detector.py

# Paste your complete final code here
from google.colab import files

files.download("qr_security_detector.py")
