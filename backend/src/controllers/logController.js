const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

const emptyLog = (date) => ({
  date,
  calories: 0,
  macros: { protein: 0, carbs: 0, fats: 0 },
  steps: 0,
  waterLiters: 0,
  sleepHours: 0,
  weightKg: null,
  workoutCompleted: false,
  note: '',
});

exports.getToday = async (req, res) => {
  const date = req.query.date;
  const log = DailyLog.findOne({ userId: req.user.id, date });
  res.json(log || emptyLog(date));
};

exports.upsertToday = async (req, res) => {
  const { date, ...payload } = req.body;
  const log = DailyLog.findOneAndUpdate(
    { userId: req.user.id, date },
    { $set: payload },
    { upsert: true, new: true }
  );

  const user = User.findById(req.user.id) || {};
  const calorieTarget = user.calorieTarget || 2550;
  const proteinTarget = (user.macroTargets && user.macroTargets.protein) || 190;
  const protein = (log.macros && log.macros.protein) || 0;

  const tips = [];
  if ((log.calories || 0) > 0 && log.calories < calorieTarget * 0.7)
    tips.push('You are well under your calorie target — add a balanced meal.');
  if (protein > 0 && protein < proteinTarget * 0.8)
    tips.push('Protein is low. Add paneer, eggs, chicken, lentils, or whey.');
  if ((log.steps || 0) > 0 && log.steps < 8000)
    tips.push('Steps are below target. A 20-minute walk closes the gap.');
  if ((log.sleepHours || 0) > 0 && log.sleepHours < 7)
    tips.push('Sleep is low. Prioritise recovery tonight.');
  if (log.workoutCompleted) tips.push('Training logged — nice work. Protein and sleep lock in the gains.');

  res.json({ log, tips });
};
