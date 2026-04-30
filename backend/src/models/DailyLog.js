const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  calories: { type: Number, default: 0 },
  macros: { protein: { type: Number, default: 0 }, carbs: { type: Number, default: 0 }, fats: { type: Number, default: 0 } },
  steps: { type: Number, default: 0 },
  waterLiters: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  workoutCompleted: { type: Boolean, default: false },
  habits: {
    sleepDone: { type: Boolean, default: false },
    stepsDone: { type: Boolean, default: false },
    waterDone: { type: Boolean, default: false },
    noJunkFood: { type: Boolean, default: false },
    gymDone: { type: Boolean, default: false }
  },
  gutHealth: {
    fiberGrams: { type: Number, default: 0 },
    bloating: { type: Boolean, default: false },
    constipation: { type: Boolean, default: false }
  }
}, { timestamps: true });

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
