const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { calculateTargets } = require('../utils/calcTargets');

const SECRET = process.env.JWT_SECRET || 'devsecret';

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
}

exports.register = async (req, res) => {
  const { name, email, password, ...profile } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);

  // Compute targets from body metrics when we have them, but let explicit
  // targets in the request win (this user's targets come from their scan, not a formula).
  const computed = profile.heightCm ? calculateTargets(profile) : {};
  const explicit = {};
  if (profile.calorieTarget != null) explicit.calorieTarget = profile.calorieTarget;
  if (profile.maintenanceCalories != null) explicit.maintenanceCalories = profile.maintenanceCalories;
  if (profile.macroTargets) explicit.macroTargets = profile.macroTargets;

  const user = User.create({ name, email, passwordHash, ...profile, ...computed, ...explicit, streak: 0 });
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '30d' });
  res.json({ token, user: publicUser(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '30d' });
  res.json({ token, user: publicUser(user) });
};

exports.me = async (req, res) => {
  res.json(publicUser(User.findById(req.user.id)));
};
