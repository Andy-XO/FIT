# FIT Coach

A system-driven fitness transformation app focused on fat loss with coaching logic.

## Structure
- `backend`: Express + MongoDB + JWT APIs
- `frontend`: React + Vite + Tailwind - an immersive **3D single-page experience**
  (Three.js / react-three-fiber) that renders your InBody 260 numbers and the
  fat-loss system as a world you scroll through. Runs standalone, no backend needed.

## The 3D experience (frontend)
A cinematic scroll journey - the camera flies down through a WebGL world:
1. **Start** - a living, breathing emerald core (you, now) in a particle field
2. **Body** - rotatable composition model: lean core, translucent fat shell,
   pulsing red visceral-fat orb (17 ⚠)
3. **Descent** - a glowing 3D slope from 116 kg → 95-100 kg milestone → goal
4. **Fuel** - animated 3D rings for calories / protein / carbs / fats
5. **System** - the full checklist as interactive cards; ticks persist in localStorage
6. **Flags** - the visceral-fat / waist-hip health warnings

Data lives in `frontend/src/data/profile.js` - edit that one file to update every
scene. Built with `@react-three/fiber`, `drei`, `postprocessing` (bloom), and
`framer-motion`.

## The Tracker (frontend ⇄ backend)
Open the **＋ Log today** button (bottom-left of the 3D site) for a slide-in tracker:
- **Today** — calories, protein/carbs/fats, steps, water, sleep, weight, "training done",
  and a note. Saved per day; returns coach tips when something's low. Progress bars vs targets.
- **Workout** — pick a template or build your own (exercises · sets · reps · kg), log it,
  and see your recent workouts.
- **Progress** — latest weight, 7-day change, kg-to-goal, a weight-trend sparkline,
  weekly adherence / training consistency, and the last 7 days.

A single local account is created automatically on this device (no login screen). Your
records persist to `backend/data/db.json`.

## Storage — no database to install
The backend uses a **zero-setup JSON file store** (`backend/src/config/store.js`) that mirrors
the Mongoose API the controllers use, so `npm run dev` just works. Data lives in
`backend/data/db.json` (git-ignored). Mongoose/MongoDB are no longer required.

## Core flows implemented
- Automatic calorie/macronutrient targets (seeded from the InBody scan)
- Daily logs for calories/macros/steps/water/sleep/weight/workout, per date
- Workout logging with starter templates + history
- Weekly analytics for adherence and training consistency
- Smart coach tips generated from daily behavior

## Run
Two terminals (or use `.claude/launch.json`):
```bash
cd backend  && npm install && npm run dev   # API on :5000, writes backend/data/db.json
cd frontend && npm install && npm run dev   # 3D app on :5173
```
The 3D experience runs without the backend; the Tracker needs the backend running.

## API routes
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me`
- `GET/POST /api/logs/today`
- `GET /api/workouts` (history), `GET /api/workouts/templates`, `POST /api/workouts`
- `GET /api/meals`, `POST /api/meals`, `GET /api/meals/templates`
- `GET /api/analytics/weekly`

## Product UX notes
- Main dashboard emphasizes decision reduction using simple targets, progress bars, and coach guidance.
- Habit score and streak-ready data model support daily consistency and gamification.
- Architecture allows adding notifications, offline caching, exports, and real-time updates.
