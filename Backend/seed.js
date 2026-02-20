require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Define test admins
    const admins = [
      {
        name: 'Super Admin',
        email: 'superadmin@court.com',
        password: 'superadmin123',
        role: 'superadmin'
      },
      {
        name: 'Clerk Admin',
        email: 'clerk@court.com',
        password: 'clerk123',
        role: 'clerk'
      }
    ];

    // Create all admins
    for (const adminData of admins) {
      const existing = await Admin.findOne({ email: adminData.email });
      if (existing) {
        console.log(`⚠️ ${adminData.role} already exists: ${adminData.email}`);
        continue;
      }

      const admin = new Admin(adminData);
      await admin.save();
      console.log(`✅ ${adminData.role} created: ${adminData.email} / ${adminData.password}`);
    }

    console.log('\n📋 Test Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('SuperAdmin:');
    console.log('  Email: superadmin@court.com');
    console.log('  Password: superadmin123');
    console.log('  Role: superadmin (Full access)');
    console.log('\nClerk:');
    console.log('  Email: clerk@court.com');
    console.log('  Password: clerk123');
    console.log('  Role: clerk (Limited access)');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedAdmin();
