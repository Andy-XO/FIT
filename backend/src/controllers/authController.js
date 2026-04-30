const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { calculateTargets } = require('../utils/calcTargets');

exports.register = async (req, res) => {
  const { name, email, password, ...profile } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const targets = calculateTargets(profile);
  const user = await User.create({ name, email, passwordHash, ...profile, ...targets });
  res.json({ id: user._id, email: user.email });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.json({ token });
};
