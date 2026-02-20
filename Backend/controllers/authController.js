const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register admin
const registerAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Validate @gmail.com domain
    if (!email || !email.endsWith('@gmail.com'))
      return res.status(400).json({ message: 'Admin email must be a @gmail.com address' });
    
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

// Login admin - Only superadmin and clerk roles can login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });
  
  // Validate @gmail.com domain
  if (!email.endsWith('@gmail.com'))
    return res.status(400).json({ message: 'Admin email must be a @gmail.com address' });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    // Verify the user has an admin role
    const validRoles = ['superadmin', 'clerk'];
    if (!validRoles.includes(admin.role)) {
      console.warn(`Login attempt by non-admin user: ${email} with role: ${admin.role}`);
      return res.status(403).json({ message: 'Only admin users can access this portal' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(admin._id);
    res.status(200).json({
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
