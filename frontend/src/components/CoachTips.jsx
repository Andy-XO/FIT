import React from 'react';

export default function CoachTips({ tips }) {
  return <div className="card"><h3 className="font-semibold mb-2">Coach Guidance</h3>{tips.map(t => <p className="text-sm mb-1" key={t}>• {t}</p>)}</div>;
}
