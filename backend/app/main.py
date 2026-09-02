import json
import logging
import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app import crud, models
from app.database import Base, SessionLocal, engine, get_db
from app.schemas import (
    AssessmentAnalyzeRequest,
    AssessmentAnalysisResponse,
    DomainStatus,
    FaceLogin,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.security import create_access_token, decode_access_token

load_dotenv()  # load .env so GROQ_API_KEY is available

logger = logging.getLogger(__name__)

# ── Groq client (optional — app still works if key is absent) ────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = "llama3-8b-8192"  # change here to swap models globally

_groq_client = None
if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here":
    try:
        from groq import Groq
        _groq_client = Groq(api_key=GROQ_API_KEY)
    except Exception as exc:  # groq not installed or key invalid at import time
        logger.warning("Groq client could not be initialized: %s", exc)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smriti API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    if payload.email and crud.get_user_by_email(db, str(payload.email)):
        raise HTTPException(status_code=400, detail="Email already registered")
    if payload.phone and crud.get_user_by_phone(db, payload.phone):
        raise HTTPException(status_code=400, detail="Phone already registered")

    user = crud.create_user(
        db,
        {
            "full_name": payload.full_name,
            "email": str(payload.email),
            "phone": payload.phone,
            "password": payload.password,
            "age": payload.age,
            "language": payload.language,
            "state_region": payload.state_region,
            "face_embedding": payload.face_embedding,
            "face_image_data": payload.face_image_data,
        },
    )

    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        age=user.age,
        language=user.language,
        state_region=user.state_region,
        is_active=user.is_active,
    )


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = crud.authenticate_user(db, payload.email, payload.phone, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email/phone or password")

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user_id=user.id, full_name=user.full_name)


@app.post("/auth/face-login", response_model=TokenResponse)
def face_login(payload: FaceLogin, db: Session = Depends(get_db)) -> TokenResponse:
    if not payload.face_embedding:
        raise HTTPException(status_code=400, detail="Face embedding is required")

    user = crud.find_best_face_match(db, payload.face_embedding)
    if not user:
        raise HTTPException(status_code=401, detail="No matching face found")

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user_id=user.id, full_name=user.full_name)


@app.get("/auth/me", response_model=UserResponse)
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> UserResponse:
    try:
        user_id = int(decode_access_token(token))
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        age=user.age,
        language=user.language,
        state_region=user.state_region,
        is_active=user.is_active,
    )


# ── Assessment analysis ──────────────────────────────────────────

_FALLBACK_ANALYSIS = AssessmentAnalysisResponse(
    summary="Assessment completed. Continue with your cognitive activities to build a fuller picture over time.",
    domains={
        "memory":      DomainStatus(status="stable",       observation="Responses suggest typical recall performance."),
        "attention":   DomainStatus(status="stable",       observation="Responses suggest steady attentional focus."),
        "recognition": DomainStatus(status="stable",       observation="Object and concept recognition appears intact."),
        "reasoning":   DomainStatus(status="stable",       observation="Logical sequencing responses are consistent."),
        "orientation": DomainStatus(status="stable",       observation="Orientation responses are within expected range."),
    },
    recommendations=[
        "Continue daily cognitive activities to maintain engagement.",
        "Memory-focused exercises may be beneficial.",
        "Consistent sleep and hydration support cognitive health.",
    ],
    disclaimer=(
        "This is a brief cognitive-performance summary based on a short questionnaire. "
        "It is not a medical diagnosis. Please consult a qualified healthcare professional "
        "for any clinical concerns."
    ),
)

_SYSTEM_PROMPT = """You are an AI assistant for a cognitive-care application designed to support elderly users.

Your task is to analyze a short self-reported cognitive assessment and return a brief, cautious performance summary.

STRICT RULES:
- Do NOT diagnose dementia, Alzheimer's disease, or any medical or neurological condition.
- Do NOT make clinical claims or use clinical language.
- Use supportive, non-alarming language.
- Observations should be brief (one sentence each).
- Always include the disclaimer that this is not a medical diagnosis.

Return ONLY valid JSON in exactly this structure (no markdown, no extra text):
{
  "summary": "<one or two sentence overall summary>",
  "domains": {
    "memory":      {"status": "<good|stable|needs_support>", "observation": "<one sentence>"},
    "attention":   {"status": "<good|stable|needs_support>", "observation": "<one sentence>"},
    "recognition": {"status": "<good|stable|needs_support>", "observation": "<one sentence>"},
    "reasoning":   {"status": "<good|stable|needs_support>", "observation": "<one sentence>"},
    "orientation": {"status": "<good|stable|needs_support>", "observation": "<one sentence>"}
  },
  "recommendations": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "disclaimer": "This is a brief cognitive-performance summary based on a short questionnaire. It is not a medical diagnosis. Please consult a qualified healthcare professional for any clinical concerns."
}"""


@app.post("/api/assessment/analyze", response_model=AssessmentAnalysisResponse)
def analyze_assessment(payload: AssessmentAnalyzeRequest) -> AssessmentAnalysisResponse:
    """
    Receive completed assessment answers, send to Groq, return structured analysis.
    Falls back to a safe default response if Groq is unavailable or returns invalid JSON.
    """
    if _groq_client is None:
        # Groq not configured — return the safe fallback immediately.
        return _FALLBACK_ANALYSIS

    # Build a compact, readable representation of the answers for Groq.
    qa_lines = "\n".join(
        f"Q{i + 1}: {item.question_text}\nAnswer: {item.chosen_option}"
        for i, item in enumerate(payload.answers)
    )
    user_message = f"Here are the assessment responses:\n\n{qa_lines}\n\nPlease analyze and return JSON."

    try:
        response = _groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user",   "content": user_message},
            ],
            temperature=0.3,
            max_tokens=800,
        )
        raw_text = response.choices[0].message.content or ""

        # Strip any accidental markdown fences Groq may add.
        raw_text = raw_text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip()

        data = json.loads(raw_text)

        # Parse into the typed response model.
        domains = {
            k: DomainStatus(
                status=v.get("status", "stable"),
                observation=v.get("observation", ""),
            )
            for k, v in data.get("domains", {}).items()
        }

        return AssessmentAnalysisResponse(
            summary=data.get("summary", _FALLBACK_ANALYSIS.summary),
            domains=domains if domains else _FALLBACK_ANALYSIS.domains,
            recommendations=data.get("recommendations", _FALLBACK_ANALYSIS.recommendations),
            disclaimer=data.get("disclaimer", _FALLBACK_ANALYSIS.disclaimer),
        )

    except Exception as exc:
        logger.warning("Groq assessment analysis failed: %s", exc)
        return _FALLBACK_ANALYSIS

