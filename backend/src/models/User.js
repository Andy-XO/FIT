// Backed by the local JSON store (see config/store.js). Fields used across the
// app: name, email, passwordHash, weightKg, goal, maintenanceCalories,
// calorieTarget, macroTargets{protein,carbs,fats}, streak.
const { collection } = require('../config/store');
module.exports = collection('users');
