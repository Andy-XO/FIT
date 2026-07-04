import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  bootstrapAuth, getMe, getToday, saveToday, listWorkouts, logWorkout, getWeekly,
} from '../../services/api';
import { todayStr, daysAgo } from '../../utils/date';
import TodayTab from './TodayTab';
import WorkoutTab from './WorkoutTab';
import ProgressTab from './ProgressTab';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'workout', label: 'Workout' },
  { id: 'progress', label: 'Progress' },
];

export default function Tracker() {
  const today = todayStr();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('today');
  const [status, setStatus] = useState('connecting'); // connecting | online | offline
  const [me, setMe] = useState(null);
  const [log, setLog] = useState(null);
  const [tips, setTips] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [weekly, setWeekly] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logging, setLogging] = useState(false);

  const loadWeekly = useCallback(() => getWeekly(daysAgo(6), today).then(setWeekly).catch(() => {}), [today]);

  const connect = useCallback(async () => {
    setStatus('connecting');
    try {
      await bootstrapAuth();
      const [m, l, w] = await Promise.all([getMe(), getToday(today), listWorkouts()]);
      setMe(m);
      setLog(l);
      setWorkouts(w);
      await loadWeekly();
      setStatus('online');
    } catch {
      setStatus('offline');
    }
  }, [today, loadWeekly]);

  useEffect(() => {
    connect();
  }, [connect]);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const { log: saved, tips: t } = await saveToday({ ...payload, date: today });
      setLog(saved);
      setTips(t || []);
      loadWeekly();
    } catch {
      setStatus('offline');
    } finally {
      setSaving(false);
    }
  };

  const handleLogWorkout = async (payload) => {
    setLogging(true);
    try {
      const w = await logWorkout(payload);
      setWorkouts((prev) => [w, ...prev]);
    } catch {
      setStatus('offline');
    } finally {
      setLogging(false);
    }
  };

  return (
    <>
      {/* launch button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 md:left-6 bottom-5 z-30 flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-[13px] text-[#05100c] shadow-lg"
        style={{ background: 'linear-gradient(90deg,#3ddc97,#5eead4)', boxShadow: '0 6px 24px rgba(61,220,151,0.35)' }}
      >
        <span className="text-base leading-none">＋</span> Log today
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] flex flex-col"
              style={{ background: 'rgba(6,18,14,0.92)', backdropFilter: 'blur(14px)', borderLeft: '1px solid rgba(94,234,212,0.18)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              {/* header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div>
                  <p className="eyebrow text-[9.5px]">Tracker · {today}</p>
                  <h2 className="text-xl font-extrabold tracking-tight">
                    {status === 'online' ? 'Log & records' : status === 'connecting' ? 'Connecting…' : 'Offline'}
                  </h2>
                </div>
                <button onClick={() => setOpen(false)} className="text-ink/50 hover:text-ink text-2xl leading-none">×</button>
              </div>

              {/* tabs */}
              <div className="flex gap-1 px-5 pb-3">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
                      tab === t.id ? 'bg-emerald2 text-[#05100c] font-bold' : 'text-ink/50 hover:text-ink'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* body */}
              <div className="flex-1 overflow-y-auto px-5 pb-8">
                {status === 'offline' && (
                  <div className="glass p-4 mb-4">
                    <p className="text-[13px] text-ink/70 mb-2">
                      Can’t reach the tracker API. Start the backend with{' '}
                      <span className="mono text-emerald2">npm run dev</span> in the <span className="mono">backend</span> folder.
                    </p>
                    <button onClick={connect} className="mono text-[11px] text-emerald2 hover:underline">retry</button>
                  </div>
                )}
                {status === 'connecting' && <p className="text-[13px] text-ink/50">Connecting to your tracker…</p>}
                {status === 'online' && tab === 'today' && (
                  <TodayTab me={me} log={log} tips={tips} saving={saving} onSave={handleSave} />
                )}
                {status === 'online' && tab === 'workout' && (
                  <WorkoutTab workouts={workouts} onLog={handleLogWorkout} logging={logging} />
                )}
                {status === 'online' && tab === 'progress' && <ProgressTab weekly={weekly} />}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
