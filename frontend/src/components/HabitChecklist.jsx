import React from 'react';

export default function HabitChecklist({ habits }) {
  const entries = [
    ['Sleep 7-9h', habits.sleepDone],
    ['8k-10k Steps', habits.stepsDone],
    ['Water 3-4L', habits.waterDone],
    ['No Junk Food', habits.noJunkFood],
    ['Gym Completed', habits.gymDone]
  ];
  const pct = Math.round((entries.filter(([, done]) => done).length / entries.length) * 100);
  return <div className="card"><h3 className="font-semibold">Habit Score: {pct}%</h3>{entries.map(([k,v])=><p key={k}>{v?'✅':'⬜'} {k}</p>)}</div>;
}
