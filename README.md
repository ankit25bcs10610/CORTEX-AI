# Cortex-AI - Intelligent Personal Workspace

Production-style full-stack app that combines tasks, habits, goals, learning, and AI coaching.

## Stack
- React + Vite + Tailwind
- React Router
- Zustand state
- Express API for secure AI calls
- Firebase Auth (Email/Password + Google)

## Features shipped
- Unified intelligent dashboard (today focus, overdue risk, streaks, progress, productivity score)
- Task management with recurring engine (daily/weekly/monthly/custom)
- Habit tracker (streaks, best streak, weekly completion strip)
- Goals planner (short/long-term, progress, status)
- Learning tracker (resources, progress, status, notes)
- AI Coach with structured insights + Ask Anything chat + voice coach
- Gamification: XP, levels, weekly challenges, achievements
- Calendar time-blocking, AI auto-planner, reminders, backup/import-export, integrations surface

## Run
```bash
npm install
npm run dev
```

## Environment
Copy `.env.example` to `.env` and set values.

### Firebase Auth
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Enable Email/Password and Google providers in Firebase Authentication.

### AI Provider
`LLM_PROVIDER=mock` uses deterministic local insight generation.

For Groq:
- `LLM_PROVIDER=groq`
- `GROQ_API_KEY=...`

For OpenAI:
- `LLM_PROVIDER=openai`
- `OPENAI_API_KEY=...`
