import React, { useEffect, useState } from 'react';
import { getWorkoutTemplates } from '../../services/api';
import { prettyDate } from '../../utils/date';

const emptyRow = () => ({ name: '', sets: '', reps: '', weight: '' });

export default function WorkoutTab({ workouts, onLog, logging }) {
  const [name, setName] = useState('');
  const [dayType, setDayType] = useState('');
  const [rows, setRows] = useState([emptyRow()]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getWorkoutTemplates().then(setTemplates).catch(() => {});
  }, []);

  const applyTemplate = (t) => {
    setName(t.name);
    setDayType(t.dayType || '');
    setRows(t.exercises.map((e) => ({ name: e.name, sets: e.sets ?? '', reps: e.reps ?? '', weight: e.weight ?? '' })));
  };

  const setRow = (i, k, v) => setRows((p) => p.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  const addRow = () => setRows((p) => [...p, emptyRow()]);
  const removeRow = (i) => setRows((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p));

  const submit = async () => {
    const exercises = rows
      .filter((r) => r.name.trim())
      .map((r) => ({
        name: r.name.trim(),
        sets: r.sets === '' ? 0 : Number(r.sets),
        reps: r.reps === '' ? 0 : Number(r.reps),
        weight: r.weight === '' ? 0 : Number(r.weight),
      }));
    await onLog({ name: name.trim() || 'Workout', dayType, exercises });
    setName(''); setDayType(''); setRows([emptyRow()]);
  };

  const inp = 'glass px-2.5 py-1.5 bg-transparent outline-none mono text-[13px] text-ink placeholder-ink/30 w-full';

  return (
    <div className="space-y-4">
      {templates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={() => applyTemplate(t)}
              className="mono text-[11px] px-3 py-1.5 rounded-full glass text-ink/70 hover:text-emerald2 transition-colors"
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="glass p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} placeholder="Workout name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inp} placeholder="Day (Upper…)" value={dayType} onChange={(e) => setDayType(e.target.value)} />
        </div>

        <div className="grid grid-cols-[1fr_44px_44px_56px_24px] gap-1.5 items-center eyebrow text-[8.5px] px-1">
          <span>Exercise</span><span>Sets</span><span>Reps</span><span>Kg</span><span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_44px_44px_56px_24px] gap-1.5 items-center">
            <input className={inp} placeholder="Bench" value={r.name} onChange={(e) => setRow(i, 'name', e.target.value)} />
            <input className={inp} type="number" value={r.sets} onChange={(e) => setRow(i, 'sets', e.target.value)} />
            <input className={inp} type="number" value={r.reps} onChange={(e) => setRow(i, 'reps', e.target.value)} />
            <input className={inp} type="number" value={r.weight} onChange={(e) => setRow(i, 'weight', e.target.value)} />
            <button onClick={() => removeRow(i)} className="text-ink/30 hover:text-rust2 text-lg leading-none">×</button>
          </div>
        ))}
        <button onClick={addRow} className="mono text-[11px] text-ink/50 hover:text-emerald2">+ add exercise</button>
      </div>

      <button
        onClick={submit}
        disabled={logging}
        className="w-full rounded-xl py-3 font-semibold text-[14px] text-[#05100c] disabled:opacity-50"
        style={{ background: 'linear-gradient(90deg,#3ddc97,#5eead4)' }}
      >
        {logging ? 'Logging…' : 'Log workout'}
      </button>

      <div>
        <p className="eyebrow mb-2 text-[9.5px]">Recent</p>
        {(!workouts || workouts.length === 0) && <p className="text-[12.5px] text-ink/40">No workouts logged yet.</p>}
        <div className="space-y-2">
          {workouts?.slice(0, 12).map((w) => (
            <div key={w._id} className="glass p-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[13.5px] font-semibold text-ink">{w.name}</span>
                <span className="mono text-[10.5px] text-ink/45">
                  {w.completedAt ? prettyDate(w.completedAt.slice(0, 10)) : ''}
                </span>
              </div>
              {w.exercises?.length > 0 && (
                <p className="mono text-[11px] text-ink/55 mt-1">
                  {w.exercises.map((e) => `${e.name} ${e.sets}×${e.reps}${e.weight ? ` @${e.weight}` : ''}`).join(' · ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
