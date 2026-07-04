import React, { useEffect, useState } from 'react';
import { NumberField, Bar, Toggle } from './ui';

const blank = {
  calories: '', protein: '', carbs: '', fats: '',
  steps: '', waterLiters: '', sleepHours: '', weightKg: '', workoutCompleted: false, note: '',
};

function fromLog(log) {
  if (!log) return blank;
  return {
    calories: log.calories || '',
    protein: log.macros?.protein || '',
    carbs: log.macros?.carbs || '',
    fats: log.macros?.fats || '',
    steps: log.steps || '',
    waterLiters: log.waterLiters || '',
    sleepHours: log.sleepHours || '',
    weightKg: log.weightKg ?? '',
    workoutCompleted: !!log.workoutCompleted,
    note: log.note || '',
  };
}

const n = (v) => (v === '' ? 0 : Number(v));

export default function TodayTab({ me, log, tips, saving, onSave }) {
  const [f, setF] = useState(fromLog(log));
  useEffect(() => setF(fromLog(log)), [log]);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const calTarget = me?.calorieTarget || 2550;
  const proTarget = me?.macroTargets?.protein || 190;

  const submit = () =>
    onSave({
      calories: n(f.calories),
      macros: { protein: n(f.protein), carbs: n(f.carbs), fats: n(f.fats) },
      steps: n(f.steps),
      waterLiters: n(f.waterLiters),
      sleepHours: n(f.sleepHours),
      weightKg: f.weightKg === '' ? null : Number(f.weightKg),
      workoutCompleted: f.workoutCompleted,
      note: f.note,
    });

  return (
    <div className="space-y-4">
      {/* target progress */}
      <div className="glass p-4 space-y-3">
        <div>
          <div className="flex justify-between mono text-[11px] text-ink/60 mb-1">
            <span>Calories</span>
            <span>{n(f.calories)} / {calTarget}</span>
          </div>
          <Bar value={n(f.calories)} target={calTarget} color="#3ddc97" />
        </div>
        <div>
          <div className="flex justify-between mono text-[11px] text-ink/60 mb-1">
            <span>Protein</span>
            <span>{n(f.protein)} / {proTarget} g</span>
          </div>
          <Bar value={n(f.protein)} target={proTarget} color="#5eead4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Calories" value={f.calories} onChange={set('calories')} step={10} suffix="kcal" />
        <NumberField label="Protein" value={f.protein} onChange={set('protein')} suffix="g" />
        <NumberField label="Carbs" value={f.carbs} onChange={set('carbs')} suffix="g" />
        <NumberField label="Fats" value={f.fats} onChange={set('fats')} suffix="g" />
        <NumberField label="Steps" value={f.steps} onChange={set('steps')} step={100} />
        <NumberField label="Water" value={f.waterLiters} onChange={set('waterLiters')} step={0.25} suffix="L" />
        <NumberField label="Sleep" value={f.sleepHours} onChange={set('sleepHours')} step={0.5} suffix="h" />
        <NumberField label="Weight" value={f.weightKg} onChange={set('weightKg')} step={0.1} suffix="kg" />
      </div>

      <Toggle on={f.workoutCompleted} onChange={set('workoutCompleted')} label="Training done today" />

      <label className="block">
        <span className="eyebrow block mb-1 text-[9.5px]">Note</span>
        <textarea
          rows={2}
          value={f.note}
          onChange={(e) => set('note')(e.target.value)}
          placeholder="How did today feel?"
          className="w-full glass px-3 py-2 bg-transparent outline-none text-[13px] text-ink placeholder-ink/30 resize-none"
        />
      </label>

      <button
        onClick={submit}
        disabled={saving}
        className="w-full rounded-xl py-3 font-semibold text-[14px] text-[#05100c] transition-opacity disabled:opacity-50"
        style={{ background: 'linear-gradient(90deg,#3ddc97,#5eead4)' }}
      >
        {saving ? 'Saving…' : 'Save today'}
      </button>

      {tips?.length > 0 && (
        <div className="glass p-4 space-y-2">
          <p className="eyebrow text-[9.5px]">Coach</p>
          {tips.map((t, i) => (
            <p key={i} className="text-[12.5px] text-ink/75 leading-snug flex gap-2">
              <span className="text-emerald2">›</span>
              {t}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
