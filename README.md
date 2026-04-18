# Vzir — AI Hotel Intelligence Platform (Frontend)

React + TypeScript frontend for Vzir. Gives hotel managers a single interface to chat with their AI assistant, view live KPIs, manage operations, and connect integrations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Routing | React Router v7 |
| Charts | Recharts |
| HTTP | Axios |
| Package Manager | npm |

---

## Prerequisites

- Node.js 18+
- npm

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/PMS-assistant/ai-hotel-frontend.git
cd ai-hotel-frontend
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

That's the only required variable for local development. The Cloudbeds variables are optional — only needed if you're testing the OAuth flow.

### 3. Run

```bash
npm run dev
```

App runs at: `http://localhost:5173`

---

## Backend Required

This frontend expects the Vzir backend running at `http://localhost:8000`.
Set up the backend first: https://github.com/PMS-assistant/ai-hotel-backend

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/home` | HomePage | Greeting, quick actions, suggested prompts |
| `/chat` | ChatPage | AI assistant chat interface |
| `/dashboard` | DashboardPage | KPIs, revenue charts, arrivals/departures |
| `/operations` | StaffPage | Room status, housekeeping |
| `/integrations` | IntegrationsPage | Connect Cloudbeds, Xero |
| `/settings` | SettingsPage | Account, property, delete account |
| `/login` | LoginPage | Auth |
| `/signup` | SignupPage | Register new hotel |
| `/onboarding` | OnboardingPage | First-time setup flow |

---

## Build

```bash
npm run build
```

Output in `dist/`.
