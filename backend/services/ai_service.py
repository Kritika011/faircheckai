import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
else:
    model = None


def get_ai_suggestions(dataset_summary):
    """Ask Gemini for practical bias-reduction recommendations."""
    if not model:
        return "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file."

    prompt = (
        "Analyze this hiring dataset and suggest ways to reduce bias. "
        "Keep the answer practical, concise, and beginner-friendly.\n\n"
        f"{dataset_summary}"
    )

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as error:
        return f"Error getting AI suggestions: {str(error)}"
