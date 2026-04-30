const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  heightCm: Number,
  weightKg: Number,
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'athlete'] },
  goal: { type: String, enum: ['fat_loss', 'maintenance', 'muscle_gain'], default: 'fat_loss' },
  maintenanceCalories: Number,
  calorieTarget: Number,
  macroTargets: { protein: Number, carbs: Number, fats: Number },
  streak: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
