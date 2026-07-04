// Your real numbers, derived from your InBody 260 scan and the Fat Loss Fuel System.
// This is the single source of truth the whole 3D experience reads from.

export const profile = {
  scan: 'InBody 260',

  // Body composition (current)
  weightKg: 116,
  bodyFatPct: 33.5,
  leanKg: 74.9,
  get fatKg() {
    return +(this.weightKg * (this.bodyFatPct / 100)).toFixed(1);
  },
  visceralFat: 17, // flagged - healthy is < 10
  waistHip: 1.06, // flagged - elevated

  // Energy & macros
  maintenanceKcal: 3050,
  targetKcal: 2550,
  protein: 190, // grams - never cut this
  carbs: 270,
  fats: 75,
  paceKgPerWeek: 0.5,

  // Meals
  meals: 4,
  kcalPerMeal: 640,

  // Journey checkpoints
  journey: [
    { label: 'Start', weight: 116, bf: 33.5, note: 'Where you are today' },
    { label: 'Milestone', weight: 97, bf: 25, note: 'Re-scan here (~95-100 kg)' },
    { label: 'Goal', weight: 88, bf: 18, note: 'Lean, strong, visceral fat down' },
  ],

  // Daily lifestyle targets
  waterL: '3-4',
  fibreG: '25-30',
  steps: '8-10k',
  sleepH: '7-9',
  training: 'Upper/Lower or PPL · 4-5 days',
};

// Macro breakdown for the ring scene
export const macros = [
  { key: 'kcal', label: 'Calories', value: 2550, unit: 'kcal', color: '#3ddc97', ring: 1 },
  { key: 'protein', label: 'Protein', value: 190, unit: 'g', color: '#5eead4', ring: 0.9, note: 'never cut this' },
  { key: 'carbs', label: 'Carbs', value: 270, unit: 'g', color: '#e9a100', ring: 0.75 },
  { key: 'fats', label: 'Fats', value: 75, unit: 'g', color: '#f0a07a', ring: 0.6 },
];

// The full checklist - the 7 groups, verbatim from your document.
export const checklist = [
  {
    num: '00',
    title: 'One-time setup',
    items: [
      { t: 'Save the tracker to your phone (home screen)' },
      { t: 'Book GP visit + baseline bloodwork', note: 'Lipids · fasting glucose / HbA1c · BP · thyroid · vitamin D · iron / ferritin' },
      { t: 'Set a daily phone reminder to open the tracker' },
      { t: 'Set targets in your app: 2,550 kcal · 190 P · 270 C · 75 F' },
      { t: 'Confirm your whey scoop size on the label', note: '~24 g protein assumed' },
      { t: 'Pick your training split - Upper/Lower or PPL, 4-5 days' },
    ],
  },
  {
    num: '01',
    title: 'Know your numbers',
    items: [
      { t: 'Weight 116 kg · body fat 33.5% · lean 74.9 kg' },
      { t: 'Maintenance ≈3,050 · target 2,550 (~0.5 kg/wk)' },
      { t: 'First milestone: ~95-100 kg / ~25%, then re-scan' },
    ],
  },
  {
    num: '02',
    title: 'Daily · supplements',
    items: [
      { t: 'Fish oil with a fat-containing meal', note: '1-2 g combined EPA+DHA' },
      { t: 'Multivitamin with breakfast' },
      { t: 'Whey - 1 scoop pre-workout, extra on low-protein days' },
      { t: 'Creatine 3-5 g', note: 'optional, any time' },
    ],
  },
  {
    num: '03',
    title: 'Daily · nutrition',
    items: [
      { t: 'Hit 2,550 kcal' },
      { t: 'Hit 190 g protein', note: 'never cut this' },
      { t: 'Eat 4 meals', note: '~640 kcal each' },
      { t: '3-4 litres water' },
      { t: '25-30 g fibre + 1 tbsp flax / soaked chia' },
      { t: 'Lean carbs toward your training window' },
    ],
  },
  {
    num: '04',
    title: 'Daily · recovery & movement',
    items: [
      { t: '8-10k steps', note: 'walk after meals' },
      { t: '7-9 hours sleep, same wake time' },
      { t: 'Training done + lifts logged', note: 'training days' },
      { t: '10-15 min mobility / stretch' },
    ],
  },
  {
    num: '05',
    title: 'Weekly review',
    items: [
      { t: 'Weigh-in using the weekly average' },
      { t: 'Waist measurement' },
      { t: 'Progress photo' },
      { t: 'Review training log - weights creeping up?' },
      { t: 'Check adherence - aim 90%, not 100%' },
    ],
  },
  {
    num: '06',
    title: 'Milestone & cycle rules',
    items: [
      { t: '4 weeks consistent + lose 2+ kg → 1 refeed day', note: '+~350 kcal carbs, protein/fat unchanged' },
      { t: 'Stalled ~4 weeks while consistent → recalc maintenance, reset deficit' },
      { t: 'The loop: Lose → Reward → Reset → Adjust → Repeat' },
    ],
  },
];

export const healthFlags = {
  num: '07',
  title: 'Health flags - act if you notice',
  items: [
    { t: 'Visceral fat 17 / waist-hip 1.06 → get the bloodwork done soon' },
    { t: 'Persistent abdominal pain · blood in stool · chest discomfort · breathlessness on light effort · faintness on the deficit → see a doctor, don’t push through' },
  ],
};
