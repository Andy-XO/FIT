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

## Core flows implemented
- Onboarding profile with automatic calorie/macronutrient target calculation
- Daily logs for calories/macros/steps/water/sleep/workout/habits/gut health
- Workout and meal tracking with starter templates (including Indian meal options)
- Weekly analytics endpoint for adherence and consistency
- Smart coach tips generated from daily behavior

## Run
```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST /api/logs/today`
- `GET /api/workouts/templates`, `POST /api/workouts`
- `GET /api/meals`, `POST /api/meals`, `GET /api/meals/templates`
- `GET /api/analytics/weekly`

## Product UX notes
- Main dashboard emphasizes decision reduction using simple targets, progress bars, and coach guidance.
- Habit score and streak-ready data model support daily consistency and gamification.
- Architecture allows adding notifications, offline caching, exports, and real-time updates.
