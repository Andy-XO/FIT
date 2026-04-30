import React from 'react';
import MetricCard from '../components/MetricCard';
import HabitChecklist from '../components/HabitChecklist';
import CoachTips from '../components/CoachTips';

const demo = {
  calories: 1550, calorieTarget: 1900, protein: 102, proteinTarget: 140, carbs: 180, carbsTarget: 190, fats: 50, fatsTarget: 60,
  steps: 6300, waterLiters: 2.2, sleepHours: 6.5, workoutCompleted: false,
  habits: { sleepDone: false, stepsDone: false, waterDone: false, noJunkFood: true, gymDone: false },
  tips: ['Protein is low, add a high-protein dinner.', 'Steps are below target, do a 20-minute walk.', 'Sleep is low, reduce screen time before bed.']
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <header className="mb-6"><h1 className="text-3xl font-bold">FIT Coach</h1><p className="text-slate-400">Your fat-loss system for nutrition, training, recovery, and habits.</p></header>
      <section className="grid md:grid-cols-3 gap-4">
        <MetricCard title="Calories" value={demo.calories} target={demo.calorieTarget} unit=" kcal" />
        <MetricCard title="Protein" value={demo.protein} target={demo.proteinTarget} unit=" g" />
        <MetricCard title="Steps" value={demo.steps} target={9000} unit="" />
        <MetricCard title="Water" value={demo.waterLiters} target={3.5} unit=" L" />
        <MetricCard title="Sleep" value={demo.sleepHours} target={8} unit=" h" />
        <div className="card"><h3 className="text-sm text-slate-400">Workout</h3><p className="text-xl">{demo.workoutCompleted ? 'Completed ✅' : 'Pending ⏳'}</p></div>
      </section>
      <section className="grid md:grid-cols-2 gap-4 mt-4"><HabitChecklist habits={demo.habits} /><CoachTips tips={demo.tips} /></section>
    </main>
  );
}
