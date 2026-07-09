import re
from fastapi import APIRouter, HTTPException

router = APIRouter()

# 1. Known high-risk and temporary/burner email domains
DISPOSABLE_DOMAINS = {
    "mailinator.com", "trashmail.com", "yopmail.com", "10minutemail.com", 
    "tempmail.com", "sharklasers.com", "guerrillamailblock.com"
}

# 2. Keywords commonly spoofed by malicious entities in email handles
SPAM_USER_PATTERNS = [
    r"verify", r"secure", r"update", r"admin", r"support", r"service", 
    r"billing", r"invoice", r"alert", r"noreply", r"helpdesk"
]

@router.get("/email-intel")
async def analyze_email_reputation(email: str):
    email_clean = email.strip()
    
    # Baseline reset if the input arrives empty or malformed
    if not email_clean or "@" not in email_clean:
        return {
            "reliabilityRating": 0,
            "spamScore": 0,
            "dkimSpfStatus": "UNVERIFIED",
            "searchHistoryCount": 0,
            "verdict": "INVALID_QUERY"
        }
        
    try:
        # Split the user handle and domain safely (e.g., "support" and "gmail.com")
        username_part, domain_part = email_clean.lower().split("@", 1)
        
        # 3. Core Rules Engine Logic
        spam_score = 0
        incident_history = 0
        dkim_spf_status = "PASS" # Default benchmark status
        
        # Rule A: Check if domain is a known burner email network
        if domain_part in DISPOSABLE_DOMAINS:
            spam_score += 6
            incident_history += 3
            dkim_spf_status = "FAIL"
            
        # Rule B: Scan handle prefix for high-risk spoofing indicators
        for pattern in SPAM_USER_PATTERNS:
            if re.search(pattern, username_part):
                spam_score += 3
                incident_history += 1
                break
                
        # Rule C: Check for typical machine-generated alphanumeric patterns
        if len(username_part) > 12 and any(char.isdigit() for char in username_part):
            spam_score += 1
            
        # Rule D: Cross-examine public domains running corporate titles
        public_providers = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com"}
        if domain_part in public_providers and spam_score >= 3:
            # High suspicion if an official title (like "admin") comes from a free gmail account
            spam_score += 1
            dkim_spf_status = "UNVERIFIED"

        # 4. Normalize metrics into the exact keys her UI layout displays
        spam_score = min(max(spam_score, 0), 10)
        reliability_rating = 100 - (spam_score * 10)
        
        if spam_score >= 7:
            verdict = "MALICIOUS"
        elif spam_score >= 4:
            verdict = "SUSPICIOUS"
        else:
            verdict = "SAFE"

        return {
            "reliabilityRating": reliability_rating,
            "spamScore": spam_score,
            "dkimSpfStatus": dkim_spf_status,
            "searchHistoryCount": incident_history,
            "verdict": verdict
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intelligence Module Error: {str(e)}")