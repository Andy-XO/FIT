const Meal = require('../models/Meal');

exports.getMeals = async (req, res) => {
  const meals = await Meal.find({ userId: req.user.id });
  res.json(meals);
};

exports.createMeal = async (req, res) => {
  const meal = await Meal.create({ ...req.body, userId: req.user.id });
  res.json(meal);
};

exports.getTemplates = async (req, res) => {
  res.json([
    { name: 'Paneer Bhurji + Roti', calories: 480, macros: { protein: 30, carbs: 45, fats: 18 } },
    { name: 'Dal Rice + Salad', calories: 520, macros: { protein: 20, carbs: 78, fats: 12 } },
    { name: 'Chicken Curry + Rice', calories: 610, macros: { protein: 42, carbs: 58, fats: 22 } }
  ]);
};
