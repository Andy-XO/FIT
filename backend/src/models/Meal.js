// Backed by the local JSON store (see config/store.js).
// Fields: userId, name, calories, macros{protein,carbs,fats}, template, tags[].
const { collection } = require('../config/store');
module.exports = collection('meals');
