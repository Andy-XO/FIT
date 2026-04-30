import React from 'react';

export default function MetricCard({ title, value, target, unit }) {
  const pct = Math.min(100, Math.round((value / Math.max(target, 1)) * 100));
  return (
    <div className="card">
      <h3 className="text-sm text-slate-400">{title}</h3>
      <p className="text-2xl font-semibold">{value}{unit}</p>
      <div className="h-2 bg-slate-700 rounded mt-2">
        <div className="h-2 bg-cyan-400 rounded" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-400 mt-1">Target: {target}{unit}</p>
    </div>
  );
}
