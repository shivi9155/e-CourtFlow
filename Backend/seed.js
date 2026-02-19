require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const existing = await Admin.findOne({ email: 'admin@court.com' });
    if (existing) return console.log('Admin already exists');

    const hashed = await bcrypt.hash('admin123', 10);
    const admin = new Admin({ name: 'Admin User', email: 'admin@court.com', password: hashed, role: 'superadmin' });
    await admin.save();
    console.log('✅ Admin created: admin@court.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
