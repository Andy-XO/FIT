const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9
};

function calculateTargets({ weightKg, heightCm, age, gender, activityLevel, goal }) {
  const base = gender === 'female'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

  const maintenance = Math.round(base * (activityFactors[activityLevel] || activityFactors.moderate));
  const adjustment = goal === 'fat_loss' ? -400 : goal === 'muscle_gain' ? 250 : 0;
  const calories = Math.max(1200, maintenance + adjustment);

  const protein = Math.round(weightKg * (goal === 'fat_loss' ? 2.0 : 1.8));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return { maintenanceCalories: maintenance, calorieTarget: calories, macroTargets: { protein, carbs, fats: fat } };
}

module.exports = { calculateTargets };
