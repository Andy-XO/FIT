const router = require('express').Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const logController = require('../controllers/logController');
const workoutController = require('../controllers/workoutController');
const mealController = require('../controllers/mealController');
const analyticsController = require('../controllers/analyticsController');

// Catch async errors and forward to the error handler (Express 4 doesn't do this).
const w = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/auth/register', w(authController.register));
router.post('/auth/login', w(authController.login));
router.get('/me', auth, w(authController.me));

router.get('/logs/today', auth, w(logController.getToday));
router.post('/logs/today', auth, w(logController.upsertToday));

router.get('/workouts', auth, w(workoutController.list));
router.get('/workouts/templates', auth, w(workoutController.getTemplates));
router.post('/workouts', auth, w(workoutController.logWorkout));

router.get('/meals', auth, w(mealController.getMeals));
router.post('/meals', auth, w(mealController.createMeal));
router.get('/meals/templates', auth, w(mealController.getTemplates));

router.get('/analytics/weekly', auth, w(analyticsController.weekly));

module.exports = router;
