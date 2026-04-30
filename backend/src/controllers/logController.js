const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

exports.getToday = async (req, res) => {
  const date = req.query.date;
  const log = await DailyLog.findOne({ userId: req.user.id, date });
  res.json(log || { date });
};

exports.upsertToday = async (req, res) => {
  const { date, ...payload } = req.body;
  const log = await DailyLog.findOneAndUpdate(
    { userId: req.user.id, date },
    { $set: payload },
    { upsert: true, new: true }
  );

  const user = await User.findById(req.user.id);
  const tips = [];
  if (log.calories < user.calorieTarget * 0.7) tips.push('You are too low on calories. Add a balanced meal.');
  if (log.macros.protein < user.macroTargets.protein * 0.8) tips.push('Protein is low. Add paneer, eggs, chicken, lentils, or whey.');
  if (log.steps < 8000) tips.push('Steps are below target. Add a 20-minute walk.');
  if (log.sleepHours < 7) tips.push('Sleep is low. Prioritize recovery tonight.');

  res.json({ log, tips });
};
