import re

CRISIS_KEYWORDS = [
    r"hurt myself",
    r"suicide",
    r"kill myself",
    r"end my life",
    r"emergency",
    r"overdose",
    r"self-harm",
    r"don't want to live"
]

CRISIS_RESPONSE = {
    "is_crisis": True,
    "response": (
        "It sounds like you're going through a very difficult time. Please know that you're not alone, and there is support available. "
        "If you are in immediate danger, please contact your local emergency services or go to the nearest emergency room. "
        "\n\nResources:\n"
        "- National Suicide Prevention Lifeline: 988 (USA)\n"
        "- Crisis Text Line: Text HOME to 741741\n"
        "- International resources: https://www.befrienders.org/"
    )
}

DISCLAIMER = "This is an AI research tool, not a substitute for professional clinical therapy. Do not give physical medical advice."

def safety_interceptor(user_input: str):
    """
    Scans user input for high-risk keywords.
    Returns (is_crisis, response)
    """
    for pattern in CRISIS_KEYWORDS:
        if re.search(pattern, user_input, re.IGNORECASE):
            return True, CRISIS_RESPONSE["response"]
    
    return False, None
