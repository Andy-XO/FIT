const Workout = require('../models/Workout');

exports.getTemplates = (req, res) => {
  res.json([
    { name: 'Full Body (3 days)', days: ['A', 'B', 'C'] },
    { name: 'Upper/Lower Split', days: ['Upper', 'Lower', 'Upper', 'Lower'] }
  ]);
};

exports.logWorkout = async (req, res) => {
  const workout = await Workout.create({ ...req.body, userId: req.user.id, completedAt: new Date() });
  res.json(workout);
};
