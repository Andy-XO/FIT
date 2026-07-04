import React from 'react';
import { prettyDate } from '../../utils/date';
import { profile } from '../../data/profile';

function Sparkline({ points }) {
  if (points.length < 2) return null;
  const ws = points.map((p) => p.weightKg);
  const min = Math.min(...ws), max = Math.max(...ws);
  const span = max - min || 1;
  const W = 260, H = 60, pad = 6;
  const x = (i) => pad + (i / (points.length - 1)) * (W - pad * 2);
  const y = (w) => pad + (1 - (w - min) / span) * (H - pad * 2);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.weightKg).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
      <path d={d} fill="none" stroke="#3ddc97" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.weightKg)} r="2.4" fill="#5eead4" />
      ))}
    </svg>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="glass p-3 text-center">
      <div className="eyebrow text-[9px] mb-1">{label}</div>
      <div className="mono text-lg font-semibold text-ink">{value}</div>
      {sub && <div className="mono text-[10px] text-ink/45 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ProgressTab({ weekly }) {
  const logs = weekly?.logs || [];
  const weights = logs.filter((l) => l.weightKg != null).map((l) => ({ date: l.date, weightKg: l.weightKg }));
  const latest = weights.length ? weights[weights.length - 1].weightKg : null;
  const first = weights.length ? weights[0].weightKg : null;
  const delta = latest != null && first != null ? +(latest - first).toFixed(1) : null;
  const toGoal = latest != null ? +(latest - profile.journey[profile.journey.length - 1].weight).toFixed(1) : null;

  const adherence = Math.round((weekly?.adherence || 0) * 100);
  const consistency = Math.round((weekly?.workoutConsistency || 0) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Weight" value={latest != null ? `${latest}` : '—'} sub="kg latest" />
        <Stat label="7-day Δ" value={delta != null ? `${delta > 0 ? '+' : ''}${delta}` : '—'} sub="kg" />
        <Stat label="To goal" value={toGoal != null ? `${toGoal}` : '—'} sub="kg left" />
      </div>

      <div className="glass p-4">
        <p className="eyebrow text-[9.5px] mb-2">Weight trend</p>
        {weights.length >= 2 ? (
          <Sparkline points={weights} />
        ) : (
          <p className="text-[12.5px] text-ink/40">Log your weight on a couple of days to see the trend.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Stat label="Adherence" value={`${adherence}%`} sub="days logged" />
        <Stat label="Training" value={`${consistency}%`} sub="of logged days" />
      </div>

      <div>
        <p className="eyebrow mb-2 text-[9.5px]">Last 7 days</p>
        {logs.length === 0 && <p className="text-[12.5px] text-ink/40">Nothing logged this week yet.</p>}
        <div className="space-y-1.5">
          {[...logs].reverse().map((l) => (
            <div key={l.date} className="glass px-3 py-2 flex items-center justify-between">
              <span className="mono text-[11.5px] text-ink/70 w-20">{prettyDate(l.date)}</span>
              <span className="mono text-[11px] text-ink/55 flex-1 text-right">
                {l.calories || 0} kcal · {l.macros?.protein || 0}P · {(l.steps || 0).toLocaleString()} steps
                {l.workoutCompleted ? ' · 🏋️' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
