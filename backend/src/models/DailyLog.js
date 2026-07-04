// Backed by the local JSON store (see config/store.js). One record per
// (userId, date). Fields: calories, macros{protein,carbs,fats}, steps,
// waterLiters, sleepHours, weightKg, workoutCompleted, note, habits{}, gutHealth{}.
const { collection } = require('../config/store');
module.exports = collection('dailyLogs');
