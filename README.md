# FIT Coach

A system-driven fitness transformation app focused on fat loss with coaching logic.

## Structure
- `backend`: Express + MongoDB + JWT APIs
- `frontend`: React + Tailwind dashboard prototype

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
