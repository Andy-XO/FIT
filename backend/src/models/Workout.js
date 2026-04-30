const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  dayType: String,
  exercises: [{ name: String, sets: Number, reps: Number, weight: Number }],
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
