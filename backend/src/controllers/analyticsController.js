const DailyLog = require('../models/DailyLog');

exports.weekly = async (req, res) => {
  const { from, to } = req.query;
  const logs = await DailyLog.find({ userId: req.user.id, date: { $gte: from, $lte: to } }).sort({ date: 1 });
  const adherence = logs.length ? logs.filter(l => l.calories > 0).length / logs.length : 0;
  const workoutConsistency = logs.length ? logs.filter(l => l.workoutCompleted).length / logs.length : 0;
  res.json({ logs, adherence, workoutConsistency });
};
