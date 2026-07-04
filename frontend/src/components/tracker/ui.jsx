import React from 'react';

export function NumberField({ label, value, onChange, step = 1, suffix, min = 0 }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1 text-[9.5px]">{label}</span>
      <div className="flex items-center glass px-3 py-2">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full bg-transparent outline-none mono text-[15px] text-ink placeholder-ink/30"
          placeholder="0"
        />
        {suffix && <span className="mono text-[11px] text-ink/40 ml-1">{suffix}</span>}
      </div>
    </label>
  );
}

export function Bar({ value = 0, target = 1, color = '#3ddc97' }) {
  const pct = Math.max(0, Math.min(100, target ? (value / target) * 100 : 0));
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex items-center justify-between w-full glass px-3 py-2.5"
    >
      <span className="text-[13px] text-ink/85">{label}</span>
      <span
        className="relative h-5 w-9 rounded-full transition-colors"
        style={{ background: on ? '#2f5d50' : 'rgba(255,255,255,0.12)' }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full transition-all"
          style={{ left: on ? 18 : 2, background: on ? '#3ddc97' : '#8aa' }}
        />
      </span>
    </button>
  );
}
