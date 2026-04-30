const router = require('express').Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const logController = require('../controllers/logController');
const workoutController = require('../controllers/workoutController');
const mealController = require('../controllers/mealController');
const analyticsController = require('../controllers/analyticsController');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/logs/today', auth, logController.getToday);
router.post('/logs/today', auth, logController.upsertToday);
router.get('/workouts/templates', auth, workoutController.getTemplates);
router.post('/workouts', auth, workoutController.logWorkout);
router.get('/meals', auth, mealController.getMeals);
router.post('/meals', auth, mealController.createMeal);
router.get('/meals/templates', auth, mealController.getTemplates);
router.get('/analytics/weekly', auth, analyticsController.weekly);

module.exports = router;
