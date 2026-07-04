const Workout = require('../models/Workout');

exports.getTemplates = (req, res) => {
  res.json([
    { name: 'Upper A', dayType: 'Upper', exercises: [
      { name: 'Bench Press', sets: 4, reps: 8 },
      { name: 'Row', sets: 4, reps: 10 },
      { name: 'Overhead Press', sets: 3, reps: 10 },
      { name: 'Lat Pulldown', sets: 3, reps: 12 },
    ] },
    { name: 'Lower A', dayType: 'Lower', exercises: [
      { name: 'Squat', sets: 4, reps: 6 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10 },
      { name: 'Leg Press', sets: 3, reps: 12 },
      { name: 'Calf Raise', sets: 4, reps: 15 },
    ] },
    { name: 'Push', dayType: 'Push', exercises: [
      { name: 'Incline Bench', sets: 4, reps: 8 },
      { name: 'Overhead Press', sets: 3, reps: 10 },
      { name: 'Cable Fly', sets: 3, reps: 15 },
      { name: 'Triceps Pushdown', sets: 3, reps: 12 },
    ] },
  ]);
};

exports.logWorkout = async (req, res) => {
  const workout = Workout.create({
    ...req.body,
    userId: req.user.id,
    completedAt: req.body.completedAt || new Date().toISOString(),
  });
  res.json(workout);
};

exports.list = async (req, res) => {
  const workouts = Workout.find({ userId: req.user.id }).sort({ completedAt: -1 });
  res.json(workouts);
};
