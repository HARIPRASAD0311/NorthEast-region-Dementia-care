from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    age: int = Field(..., ge=1, le=120)
    language: str = Field(..., min_length=2)
    state_region: str = Field(..., min_length=2)
    face_embedding: Optional[list[float]] = None
    face_image_data: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = "".join(ch for ch in value if ch.isdigit() or ch in "+-")
        return cleaned.strip() or None


class UserLogin(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str


class FaceLogin(BaseModel):
    face_embedding: list[float] = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    age: int
    language: str
    state_region: str
    is_active: bool


# ── Assessment analysis ──────────────────────────────────────────

class AssessmentAnswerItem(BaseModel):
    """One question + the user's chosen answer."""
    question_id: str
    question_text: str
    chosen_option: str


class AssessmentAnalyzeRequest(BaseModel):
    """Payload sent from the React assessment page."""
    answers: list[AssessmentAnswerItem]


class DomainStatus(BaseModel):
    status: str   # e.g. "good", "stable", "needs_support"
    observation: str


class AssessmentAnalysisResponse(BaseModel):
    """Structured AI analysis returned to the frontend."""
    summary: str
    domains: dict[str, DomainStatus]
    recommendations: list[str]
    disclaimer: str
