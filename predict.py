# ==========================================
# INSTALL REQUIRED LIBRARY
# ==========================================

!pip install python-whois

# ==========================================
# IMPORT LIBRARIES
# ==========================================

import joblib
import whois
import ssl
import socket
from urllib.parse import urlparse
from datetime import datetime, timezone
import pandas as pd

# ==========================================
# LOAD TRAINED MODEL
# ==========================================

model = joblib.load("best_phishing_model.pkl")

# ==========================================
# USER INPUT
# ==========================================

url = input("Enter URL: ")

# ==========================================
# EXTRACT DOMAIN
# ==========================================

domain = urlparse(url).netloc.lower()

if domain.startswith("www."):
    domain = domain[4:]

# ==========================================
# DOMAIN AGE CHECK
# ==========================================

try:

    info = whois.whois(domain)

    creation = info.creation_date

    if isinstance(creation, list):
        creation = creation[0]

    print("\nCreation Date :", creation)

    if creation is not None:

        if creation.tzinfo is not None:
            now = datetime.now(timezone.utc)
        else:
            now = datetime.now()

        domain_age = (now - creation).days

    else:
        domain_age = 0

except Exception as e:

    print("\nWHOIS ERROR :", e)
    domain_age = 0

# ==========================================
# SSL CERTIFICATE CHECK
# ==========================================

try:

    context = ssl.create_default_context()

    with context.wrap_socket(
        socket.socket(),
        server_hostname=domain
    ) as s:

        s.settimeout(5)
        s.connect((domain, 443))

    ssl_status = "Valid"

except Exception as e:

    print("\nSSL ERROR :", e)
    ssl_status = "Invalid"

# ==========================================
# TRUST SCORE CALCULATION
# ==========================================

trust_score = 100

# Domain Age

if domain_age == 0:
    trust_score -= 30

elif domain_age < 180:
    trust_score -= 20

# SSL

if ssl_status == "Invalid":
    trust_score -= 20

# Keep score between 0 and 100

trust_score = max(0, min(trust_score, 100))

# ==========================================
# WEB TRUST
# PASS if score is 60 or above
# ==========================================

if trust_score >= 60:
    web_trust = "PASS"
else:
    web_trust = "FAIL"

# ==========================================
# WEBSITE BEHAVIOR
# ==========================================

if trust_score == 100:
    website_behavior = "Excellent"

elif trust_score >= 80:
    website_behavior = "Good"

elif trust_score >= 60:
    website_behavior = "Average"

elif trust_score >= 40:
    website_behavior = "Below Average"

elif trust_score >= 20:
    website_behavior = "Bad"

else:
    website_behavior = "Very Bad"

# ==========================================
# SECURITY RECOMMENDATION
# ==========================================

if website_behavior == "Excellent":

    recommendation = (
        "This website appears highly trustworthy. "
        "It has a valid SSL certificate and a well-established domain."
    )

elif website_behavior == "Good":

    recommendation = (
        "The website appears trustworthy. "
        "You can browse normally but always verify sensitive information."
    )

elif website_behavior == "Average":

    recommendation = (
        "The website appears reasonably safe, but some risk factors exist. "
        "Be cautious before entering passwords or financial information."
    )

elif website_behavior == "Below Average":

    recommendation = (
        "Several warning signs were detected. "
        "Proceed carefully and avoid sharing sensitive information."
    )

elif website_behavior == "Bad":

    recommendation = (
        "High risk detected. "
        "Avoid logging in or making online payments on this website."
    )

else:

    recommendation = (
        "Very high risk detected. "
        "This website may be unsafe or potentially malicious. "
        "It is strongly recommended to avoid visiting it."
    )

# ==========================================
# FINAL REPORT
# ==========================================

print("\n")
print("=" * 60)
print("              WEBSITE TRUST REPORT")
print("=" * 60)

print(f"Domain               : {domain}")
print(f"Domain Age           : {domain_age} days")
print(f"SSL Certificate      : {ssl_status}")
print(f"Trust Score          : {trust_score}/100")
print(f"Web Trust            : {web_trust}")
print(f"Website Behavior     : {website_behavior}")

print("-" * 60)
print("Recommendation:")
print(recommendation)

print("=" * 60)

from google.colab import files
files.download("predict.py")
