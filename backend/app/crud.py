from sqlalchemy.orm import Session

from app.models import User
from app.security import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_phone(db: Session, phone: str) -> User | None:
    return db.query(User).filter(User.phone == phone).first()


def create_user(db: Session, data: dict) -> User:
    user = User(
        full_name=data["full_name"],
        email=data["email"],
        phone=data.get("phone"),
        password_hash=get_password_hash(data["password"]),
        age=data["age"],
        language=data["language"],
        state_region=data["state_region"],
        face_embedding=data.get("face_embedding"),
        face_image_data=data.get("face_image_data"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str | None, phone: str | None, password: str) -> User | None:
    user = None
    if email:
        user = get_user_by_email(db, email)
    elif phone:
        user = get_user_by_phone(db, phone)

    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def find_best_face_match(db: Session, embedding: list[float], threshold: float = 0.18) -> User | None:
    candidates = db.query(User).filter(User.face_embedding.isnot(None)).all()
    best_match = None
    best_score = None

    for user in candidates:
        saved = user.face_embedding
        if not isinstance(saved, list):
            continue
        if len(saved) != len(embedding):
            continue

        diff = 0.0
        for a, b in zip(saved, embedding):
            diff += abs(float(a) - float(b))
        score = diff / max(len(embedding), 1) / 255.0
        if score <= threshold and (best_score is None or score < best_score):
            best_score = score
            best_match = user

    return best_match
