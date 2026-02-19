const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register admin
const registerAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists)
      return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password, role });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error while registering admin' });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(admin._id);
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { registerAdmin, loginAdmin };
