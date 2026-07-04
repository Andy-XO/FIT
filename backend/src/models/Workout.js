// Backed by the local JSON store (see config/store.js).
// Fields: userId, name, dayType, exercises[{name,sets,reps,weight}], completedAt.
const { collection } = require('../config/store');
module.exports = collection('workouts');
