import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const api = axios.create({ baseURL, timeout: 8000 });

export function setToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

// A single local account for this device — no login screen for a personal tracker.
const LOCAL = { name: 'You', email: 'local@fit.local', password: 'local-device-key' };
// Seed the account with the targets from your scan (not a generic formula).
const PROFILE_SEED = {
  weightKg: 116,
  goal: 'fat_loss',
  maintenanceCalories: 3050,
  calorieTarget: 2550,
  macroTargets: { protein: 190, carbs: 270, fats: 75 },
};

const TOKEN_KEY = 'fit-token';

async function doBootstrap() {
  let token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    setToken(token);
    try {
      await api.get('/me');
      return token;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      token = null;
    }
  }
  try {
    const { data } = await api.post('/auth/login', { email: LOCAL.email, password: LOCAL.password });
    token = data.token;
  } catch {
    const { data } = await api.post('/auth/register', { ...LOCAL, ...PROFILE_SEED });
    token = data.token;
  }
  localStorage.setItem(TOKEN_KEY, token);
  setToken(token);
  return token;
}

// Memoised so concurrent callers (tracker + live stats) share one bootstrap —
// avoids a double-register race on first ever load. Retries only on failure.
let bootstrapPromise = null;
export function bootstrapAuth() {
  if (!bootstrapPromise) {
    bootstrapPromise = doBootstrap().catch((e) => {
      bootstrapPromise = null; // allow retry
      throw e;
    });
  }
  return bootstrapPromise;
}

export const getMe = () => api.get('/me').then((r) => r.data);
export const getToday = (date) => api.get('/logs/today', { params: { date } }).then((r) => r.data);
export const saveToday = (payload) => api.post('/logs/today', payload).then((r) => r.data);
export const listWorkouts = () => api.get('/workouts').then((r) => r.data);
export const getWorkoutTemplates = () => api.get('/workouts/templates').then((r) => r.data);
export const logWorkout = (payload) => api.post('/workouts', payload).then((r) => r.data);
export const getWeekly = (from, to) =>
  api.get('/analytics/weekly', { params: { from, to } }).then((r) => r.data);
