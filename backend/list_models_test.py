import os
import httpx
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print("API Key exists:", bool(api_key))
if api_key:
    print("API Key preview:", api_key[:10] + "...")

# 1. Test listing models via v1beta
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
try:
    print(f"Requesting models from {url}...")
    res = httpx.get(url, timeout=10.0)
    print("Status code:", res.status_code)
    if res.status_code == 200:
        models = res.json().get("models", [])
        print(f"Found {len(models)} models:")
        for m in models:
            print("  -", m.get("name"))
    else:
        print("Error response:", res.text)
except Exception as e:
    print("Request failed:", e)

# 2. Test generateContent with gemini-1.5-flash or gemini-2.5-flash or gemini-2.0-flash
models_to_test = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"]
for model in models_to_test:
    url_gen = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": "Hello, this is a test. Reply with one word."}]}]
    }
    try:
        print(f"\nTesting generateContent for {model}...")
        res = httpx.post(url_gen, json=payload, headers={"Content-Type": "application/json"}, timeout=10.0)
        print(f"Status code for {model}: {res.status_code}")
        if res.status_code == 200:
            print("Response:", res.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text"))
        else:
            print("Error response:", res.text)
    except Exception as e:
        print(f"GenerateContent failed for {model}:", e)
