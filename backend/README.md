# Smriti FastAPI Authentication Backend

This backend provides a working sign-in flow built with FastAPI and SQLAlchemy.

## Features
- User registration with email/password
- Login via email or phone number
- Face-based sign-in using a numeric embedding vector
- JWT access tokens
- SQLite database with SQLAlchemy models

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   . .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Overview

### Register user
```http
POST /auth/register
```

Body example:
```json
{
  "full_name": "Rahul Das",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "password": "secret123",
  "age": 68,
  "language": "Assamese",
  "state_region": "Assam",
  "face_embedding": [1.0, 2.0, 3.5],
  "face_image_data": "data:image/jpeg;base64,..."
}
```

### Login with email/phone
```http
POST /auth/login
```

```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

### Face login
```http
POST /auth/face-login
```

```json
{
  "face_embedding": [1.0, 2.0, 3.5]
}
```

### Get current user
```http
GET /auth/me
```
Add a bearer token in the Authorization header.

## Notes
This is a secure starting point for a real biometric implementation. For production, replace the simple face embedding comparison with a proper face recognition system such as OpenCV + face embeddings, DeepFace, or a cloud vision API.
