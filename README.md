# Limbo — AI-Assisted Adaptive Cognitive Care Platform

**An AI-powered, culturally personalized cognitive-care platform for elderly people experiencing dementia-related cognitive difficulties, built for the languages, culture, and connectivity realities of Northeast India.**

Built for Smart India Hackathon 2026 · MDoNER problem statement track

---

## ⚠️ Important Positioning

Limbo is a **cognitive screening, personalization, and engagement platform** — it does **not** diagnose dementia and is not a substitute for professional medical evaluation. Every screening, activity, and progress screen in this product is written and reviewed against that principle. Where the system identifies a decline in performance, it recommends professional consultation; it never issues a medical verdict.

---

## Overview

Most digital cognitive-care tools give every user the same activities at the same difficulty, are built without regional language or cultural support, and assume continuous smartphone connectivity — three assumptions that don't hold for a large share of elderly users in Northeast India.

Limbo is built around a continuous adaptive loop:

```
Assess → Profile → Personalize → Play → Measure → Adapt → Reassess
```

A user completes a short AI-guided screening, the system builds a cognitive-performance profile, recommends a personalized activity, and then adjusts difficulty in real time based on accuracy, response time, mistakes, and hints used — closing the loop back into personalization after every session.

## Core Features

| Feature | Status |
|---|---|
| AI-assisted cognitive screening | ✅ Implemented |
| Cognitive-performance profile | ✅ Implemented |
| Personalized activity recommendation engine | ✅ Implemented |
| Rules-based adaptive difficulty engine | ✅ Implemented |
| Three cognitive activity categories (Training / Stimulation / Rehabilitation) | ✅ Implemented (2 fully playable mini-games, 4 placeholder round-based activities) |
| Performance tracking & progress dashboard | ✅ Implemented |
| Caregiver dashboard (non-alarming, factual trend reporting) | ✅ Implemented |
| Voice guidance (browser speech synthesis) | ✅ Implemented |
| Cultural personalization (8 North Eastern states) | 🚧 1 state theme fully built, remaining 7 planned |
| Multilingual UI & voice (via Bhashini) | 🚧 Planned |
| Telephone/IVR access for non-smartphone users | 🚧 Planned |
| Offline-first sync | 🚧 Planned |
| Face-recognition authentication | 🚧 Registration/sign-in built separately (vanilla JS + camera) |

## Why This Exists

- Existing India-based tools solve one piece each — NIMHANS's iCARE is caregiver-led, PHC-CST is screening-only, MemoTag is monitoring-only. Limbo combines screening, adaptive activity, and caregiver monitoring in one continuous flow.
- India's national dementia helpline (Dementia India Alliance) operates in six languages — none from the Northeast. Limbo is purpose-built to close that gap.
- Elderly users without smartphones are typically excluded from digital cognitive care entirely. Limbo's planned telephone access path is designed to include them.

## Tech Stack

- **Frontend:** React 18 + Vite, `react-router-dom`, `lucide-react`
- **Backend (planned):** Node.js (Express) or FastAPI
- **Database (planned):** PostgreSQL
- **AI / Adaptive Logic:** Transparent rules-based adaptive difficulty engine; LLM-based conversational agent for screening
- **Voice & Language (planned):** [Bhashini](https://bhashini.gov.in) — Govt. of India language AI mission, for regional STT/TTS
- **Telephony (planned):** Twilio / Exotel
- **Auth (built separately):** Face recognition with PIN fallback

## Project Structure

```
limbo-app/
├── src/
│   ├── components/       # Reusable UI components (cards, nav, accessibility controls)
│   ├── pages/             # Route-level pages (Dashboard, Activities, Game, Progress, etc.)
│   ├── data/               # Sample user data, activity catalog, cultural theming data
│   ├── services/          # Adaptive engine, recommendation engine, storage layer
│   └── styles/             # Global design tokens, dashboard & game-specific styles
├── index.html
├── package.json
└── vite.config.js
```

Every folder maps 1:1 to a stage of the Assess → Profile → Personalize → Play → Measure → Adapt → Reassess loop — see `docs/architecture.md` if present, or the Dashboard page for a live view of this loop.

## Getting Started

```bash
git clone <repo-url>
cd limbo-app
npm install
npm run dev
```

The app runs on Vite's default dev server. Build for production with:

```bash
npm run build
```

## The Adaptive Engine

`src/services/adaptiveEngine.js` is intentionally **rules-based, not a black-box model**. In a health-adjacent product, every difficulty adjustment needs to be explainable — to the user, to a caregiver, and in a hackathon Q&A. The engine considers accuracy, mistake count, and response time together (not just right/wrong) before deciding whether to increase, hold, or ease difficulty, and always returns a human-readable reason alongside the decision.

## Ethical & Compliance Notes

- All performance-decline or risk signals are routed to the **caregiver dashboard only** — the patient-facing UI never uses urgency or alarming language.
- Face-recognition and health data handling are designed around India's **Digital Personal Data Protection Act, 2023**.
- Screening content in this prototype is a structural placeholder and has **not** been clinically validated — this must happen before any real deployment.

## Roadmap

1. **Now:** Core adaptive engine, screening flow, dashboard, 2 mini-games — working prototype
2. **Next:** Remaining 7 state cultural themes, full multilingual voice via Bhashini
3. **Then:** Telephone/IVR access path, offline-first sync
4. **Later:** Clinical review of screening content, pilot with a real NER old-age home/NGO partner

## References & Research

- [Digital Personal Data Protection Act, 2023](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf) — Ministry of Electronics & IT
- [Bhashini](https://bhashini.gov.in) — National Language Translation Mission
- [Tele-MANAS](https://telemanas.mohfw.gov.in) — Govt of India telephone mental-health helpline (precedent for our telephony model)
- [Prevalence of dementia in India (LASI-DAD)](https://pubmed.ncbi.nlm.nih.gov/36637034/) — *Alzheimer's & Dementia*, 7.4% prevalence in adults 60+
- [iCARE / caregiver-driven cognitive training (NIMHANS)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11713932/)
- [PHC-CST cognitive screening tool](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12726538/)
- [Dementia India Alliance — National Dementia Support Line](https://dementia-india.org/helpline.html)

## Disclaimer

This is a hackathon prototype. Screening content, adaptive thresholds, and cultural personalization data are placeholders for demonstration purposes and require clinical and community review before any real-world deployment.

## License

*Add your team's chosen license here (MIT is a common default for hackathon projects).*

## Team

Team : AIVORA
Frontend :  Hariprasad D - https://github.com/HARIPRASAD0311
            Srilekha - https://github.com/srilekhamanikannan
            
Game     :  Swethasri - https://github.com/swethasri-cyber
            Hariharan S - https://github.com/hariharan007-dev
            
Backend  :  Iraiyanbu   - https://github.com/iraiyanbu882-rgb

AI Model :  Srinivasan - https://github.com/srini26vas27an-detroit
           
