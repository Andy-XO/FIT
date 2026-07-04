import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  bootstrapAuth, getMe, getToday, saveToday, listWorkouts, logWorkout,
} from '../services/api';
import { api } from '../services/api';
import { todayStr, daysAgo } from '../utils/date';
import { profile } from '../data/profile';

const Ctx = createContext(null);
export const useTracker = () => useContext(Ctx);

// Compute last-7-day adherence + consistency client-side from a history window.
function weeklyFrom(history) {
  const cutoff = daysAgo(6);
  const logs = history.filter((l) => l.date >= cutoff).sort((a, b) => (a.date < b.date ? -1 : 1));
  const adherence = logs.length ? logs.filter((l) => (l.calories || 0) > 0).length / logs.length : 0;
  const workoutConsistency = logs.length ? logs.filter((l) => l.workoutCompleted).length / logs.length : 0;
  return { logs, adherence, workoutConsistency };
}

export function TrackerProvider({ children }) {
  const today = todayStr();
  const [status, setStatus] = useState('connecting'); // connecting | online | offline
  const [me, setMe] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [tips, setTips] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [history, setHistory] = useState([]); // ~30 days of logs
  const [saving, setSaving] = useState(false);
  const [logging, setLogging] = useState(false);

  const loadHistory = useCallback(async () => {
    const { data } = await api.get('/analytics/weekly', { params: { from: daysAgo(29), to: today } });
    setHistory(data.logs || []);
    return data.logs || [];
  }, [today]);

  const connect = useCallback(async () => {
    setStatus('connecting');
    try {
      await bootstrapAuth();
      const [m, l, w] = await Promise.all([getMe(), getToday(today), listWorkouts()]);
      setMe(m);
      setTodayLog(l);
      setWorkouts(w);
      await loadHistory();
      setStatus('online');
    } catch {
      setStatus('offline');
    }
  }, [today, loadHistory]);

  useEffect(() => {
    connect();
  }, [connect]);

  const save = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        const { log: saved, tips: t } = await saveToday({ ...payload, date: today });
        setTodayLog(saved);
        setTips(t || []);
        await loadHistory();
        return saved;
      } catch {
        setStatus('offline');
      } finally {
        setSaving(false);
      }
    },
    [today, loadHistory]
  );

  const addWorkout = useCallback(async (payload) => {
    setLogging(true);
    try {
      const w = await logWorkout(payload);
      setWorkouts((prev) => [w, ...prev]);
      return w;
    } catch {
      setStatus('offline');
    } finally {
      setLogging(false);
    }
  }, []);

  // Derived live stats the 3D world + hero read from.
  const startWeight = profile.journey[0].weight;
  const goalWeight = profile.journey[profile.journey.length - 1].weight;
  const latestWeight = useMemo(() => {
    if (todayLog?.weightKg != null) return todayLog.weightKg;
    const withW = history.filter((l) => l.weightKg != null).sort((a, b) => (a.date < b.date ? -1 : 1));
    if (withW.length) return withW[withW.length - 1].weightKg;
    return startWeight;
  }, [todayLog, history, startWeight]);

  const weekly = useMemo(() => weeklyFrom(history), [history]);

  const value = {
    status, me, todayLog, tips, workouts, history, weekly,
    saving, logging, connect, save, addWorkout,
    today, latestWeight, startWeight, goalWeight,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
