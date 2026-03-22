require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Judge = require('./models/Judge');
const Case = require('./models/Case');
const Hearing = require('./models/Hearing');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing data (optional - comment out if you want to preserve data)
    // await Admin.deleteMany({});
    // await Judge.deleteMany({});
    // await Case.deleteMany({});
    await Hearing.deleteMany({});  // Clean up old hearings with duplicate date fields

    console.log('\n📋 Seeding Data...\n');

    // ✅ SEED JUDGES
    const judges = [
      {
        name: 'Hon. Justice Rajesh Kumar',
        email: 'rajesh.kumar@court.com',
        phone: '+91-9876543210',
        court: 'High Court - Delhi',
        specialization: 'Civil Law',
        experience: 15,
        availabilityStatus: 'available'
      },
      {
        name: 'Hon. Justice Priya Singh',
        email: 'priya.singh@court.com',
        phone: '+91-9876543211',
        court: 'District Court - Delhi',
        specialization: 'Criminal Law',
        experience: 12,
        availabilityStatus: 'available'
      },
      {
        name: 'Hon. Justice Arjun Patel',
        email: 'arjun.patel@court.com',
        phone: '+91-9876543212',
        court: 'Family Court - Delhi',
        specialization: 'Family Law',
        experience: 10,
        availabilityStatus: 'busy'
      },
      {
        name: 'Hon. Justice Neha Sharma',
        email: 'neha.sharma@court.com',
        phone: '+91-9876543213',
        court: 'Corporate Court - Delhi',
        specialization: 'Corporate Law',
        experience: 18,
        availabilityStatus: 'available'
      },
      {
        name: 'Hon. Justice Vikram Reddy',
        email: 'vikram.reddy@court.com',
        phone: '+91-9876543214',
        court: 'High Court - Mumbai',
        specialization: 'Administrative Law',
        experience: 14,
        availabilityStatus: 'available'
      },
      {
        name: 'Hon. Justice Anjali Desai',
        email: 'anjali.desai@court.com',
        phone: '+91-9876543215',
        court: 'District Court - Mumbai',
        specialization: 'Labor Law',
        experience: 9,
        availabilityStatus: 'available'
      },
      {
        name: 'Hon. Justice Sanjay Gupta',
        email: 'sanjay.gupta@court.com',
        phone: '+91-9876543216',
        court: 'High Court - Bangalore',
        specialization: 'Constitutional Law',
        experience: 20,
        availabilityStatus: 'on-leave'
      },
      {
        name: 'Hon. Justice Meera Iyer',
        email: 'meera.iyer@court.com',
        phone: '+91-9876543217',
        court: 'Family Court - Mumbai',
        specialization: 'Family Law',
        experience: 11,
        availabilityStatus: 'available'
      },
      {
        name: 'Hon. Justice Arun Singh',
        email: 'arun.singh@court.com',
        phone: '+91-9876543218',
        court: 'District Court - Bangalore',
        specialization: 'Criminal Law',
        experience: 13,
        availabilityStatus: 'busy'
      },
      {
        name: 'Hon. Justice Divya Kapoor',
        email: 'divya.kapoor@court.com',
        phone: '+91-9876543219',
        court: 'Corporate Court - Mumbai',
        specialization: 'Corporate Law',
        experience: 16,
        availabilityStatus: 'available'
      }
    ];

    let savedJudges = [];
    for (const judgeData of judges) {
      const existing = await Judge.findOne({ email: judgeData.email });
      if (!existing) {
        const judge = await Judge.create(judgeData);
        savedJudges.push(judge);
        console.log(`✅ Judge created: ${judge.name}`);
      } else {
        savedJudges.push(existing);
        console.log(`⚠️ Judge already exists: ${existing.name}`);
      }
    }

    // ✅ SEED CASES
    const cases = [
      {
        caseId: 'CASE001',
        caseNumber: 'HC/2024/001',
        title: 'ABC Corp vs XYZ Ltd - Contract Dispute',
        caseType: 'Civil',
        filingDate: new Date('2024-01-15'),
        status: 'Ongoing',
        plaintiffName: 'ABC Corporation',
        defendantName: 'XYZ Limited',
        assignedJudge: savedJudges[0]._id,
        description: 'Contract dispute regarding non-fulfillment of service agreement',
        parties: {
          petitioner: 'ABC Corporation',
          respondent: 'XYZ Limited'
        }
      },
      {
        caseId: 'CASE002',
        caseNumber: 'DC/2024/002',
        title: 'State vs Ram Kumar - Criminal Case',
        caseType: 'Criminal',
        filingDate: new Date('2024-02-10'),
        status: 'Ongoing',
        plaintiffName: 'State of Delhi',
        defendantName: 'Ram Kumar',
        assignedJudge: savedJudges[1]._id,
        description: 'Criminal case involving theft and fraud',
        parties: {
          petitioner: 'State of Delhi',
          respondent: 'Ram Kumar'
        }
      },
      {
        caseId: 'CASE003',
        caseNumber: 'FC/2024/003',
        title: 'Rajesh vs Sunita - Divorce Case',
        caseType: 'Family',
        filingDate: new Date('2024-03-05'),
        status: 'Pending',
        plaintiffName: 'Rajesh Kumar',
        defendantName: 'Sunita Kumar',
        assignedJudge: savedJudges[2]._id,
        description: 'Divorce petition with custody and maintenance issues',
        parties: {
          petitioner: 'Rajesh Kumar',
          respondent: 'Sunita Kumar'
        }
      },
      {
        caseId: 'CASE004',
        caseNumber: 'CC/2024/004',
        title: 'Tech Solutions Inc vs Investors - Merger Issue',
        caseType: 'Corporate',
        filingDate: new Date('2024-01-20'),
        status: 'Ongoing',
        plaintiffName: 'Tech Solutions Inc',
        defendantName: 'Investor Group',
        assignedJudge: savedJudges[3]._id,
        description: 'Corporate merger dispute and shareholder disagreement',
        parties: {
          petitioner: 'Tech Solutions Inc',
          respondent: 'Investor Group'
        }
      },
      {
        caseId: 'CASE005',
        caseNumber: 'HC/2024/005',
        title: 'Sharma vs Malik - Property Dispute',
        caseType: 'Civil',
        filingDate: new Date('2024-02-28'),
        status: 'Pending',
        plaintiffName: 'Vikram Sharma',
        defendantName: 'Ahmed Malik',
        assignedJudge: savedJudges[0]._id,
        description: 'Property boundary and ownership dispute',
        parties: {
          petitioner: 'Vikram Sharma',
          respondent: 'Ahmed Malik'
        }
      },
      {
        caseId: 'CASE006',
        caseNumber: 'DC/2024/006',
        title: 'State vs Priya Verma - Robbery Case',
        caseType: 'Criminal',
        filingDate: new Date('2024-03-12'),
        status: 'Ongoing',
        plaintiffName: 'State of Mumbai',
        defendantName: 'Priya Verma',
        assignedJudge: savedJudges[5]._id,
        description: 'Armed robbery and attempted murder case',
        parties: {
          petitioner: 'State of Mumbai',
          respondent: 'Priya Verma'
        }
      },
      {
        caseId: 'CASE007',
        caseNumber: 'HC/2024/007',
        title: 'Global Tech vs Local IT - IP Infringement',
        caseType: 'Corporate',
        filingDate: new Date('2024-02-01'),
        status: 'Closed',
        plaintiffName: 'Global Tech Corp',
        defendantName: 'Local IT Services',
        assignedJudge: savedJudges[3]._id,
        description: 'Intellectual property infringement and patent violation',
        parties: {
          petitioner: 'Global Tech Corp',
          respondent: 'Local IT Services'
        }
      },
      {
        caseId: 'CASE008',
        caseNumber: 'FC/2024/008',
        title: 'Kapoor vs Kapoor - Maintenance Dispute',
        caseType: 'Family',
        filingDate: new Date('2024-03-20'),
        status: 'Pending',
        plaintiffName: 'Mrs. Kapoor',
        defendantName: 'Mr. Kapoor',
        assignedJudge: savedJudges[7]._id,
        description: 'Spousal maintenance and property settlement dispute',
        parties: {
          petitioner: 'Mrs. Kapoor',
          respondent: 'Mr. Kapoor'
        }
      },
      {
        caseId: 'CASE009',
        caseNumber: 'HC/2024/009',
        title: 'Builder vs Homebuyer - Construction Defect',
        caseType: 'Civil',
        filingDate: new Date('2024-01-10'),
        status: 'Ongoing',
        plaintiffName: 'Residential Builder Ltd',
        defendantName: 'Homebuyer',
        assignedJudge: savedJudges[4]._id,
        description: 'Construction defects and breach of warranty claims',
        parties: {
          petitioner: 'Residential Builder Ltd',
          respondent: 'Homebuyer'
        }
      },
      {
        caseId: 'CASE010',
        caseNumber: 'DC/2024/010',
        title: 'State vs Ajay Singh - Drug Trafficking',
        caseType: 'Criminal',
        filingDate: new Date('2024-03-01'),
        status: 'Ongoing',
        plaintiffName: 'State of Bangalore',
        defendantName: 'Ajay Singh',
        assignedJudge: savedJudges[8]._id,
        description: 'Illegal drug trafficking and possession with intent to sell',
        parties: {
          petitioner: 'State of Bangalore',
          respondent: 'Ajay Singh'
        }
      },
      {
        caseId: 'CASE011',
        caseNumber: 'CC/2024/011',
        title: 'Finance Corp vs Debtor - Loan Recovery',
        caseType: 'Corporate',
        filingDate: new Date('2024-02-15'),
        status: 'Pending',
        plaintiffName: 'Finance Corporation',
        defendantName: 'Debtor Business',
        assignedJudge: savedJudges[9]._id,
        description: 'Loan recovery and debt settlement proceedings',
        parties: {
          petitioner: 'Finance Corporation',
          respondent: 'Debtor Business'
        }
      },
      {
        caseId: 'CASE012',
        caseNumber: 'HC/2024/012',
        title: 'Landlord vs Tenant - Eviction',
        caseType: 'Civil',
        filingDate: new Date('2024-03-15'),
        status: 'Pending',
        plaintiffName: 'Property Owner',
        defendantName: 'Tenant',
        assignedJudge: savedJudges[0]._id,
        description: 'Non-payment of rent and illegal occupancy eviction',
        parties: {
          petitioner: 'Property Owner',
          respondent: 'Tenant'
        }
      }
    ];

    let savedCases = [];
    for (const caseData of cases) {
      const existing = await Case.findOne({ caseNumber: caseData.caseNumber });
      if (!existing) {
        const newCase = await Case.create(caseData);
        savedCases.push(newCase);
        
        // ✅ Add case to judge's assignedCases array
        if (newCase.assignedJudge) {
          await Judge.findByIdAndUpdate(
            newCase.assignedJudge,
            { $push: { assignedCases: newCase._id } },
            { new: true }
          );
        }
        
        console.log(`✅ Case created: ${newCase.caseNumber} - ${newCase.title}`);
      } else {
        savedCases.push(existing);
        console.log(`⚠️ Case already exists: ${existing.caseNumber}`);
      }
    }

    // ✅ SEED HEARINGS
    const hearings = [
      {
        caseId: savedCases[0]._id,
        judgeId: savedJudges[0]._id,
        hearingDate: new Date('2026-04-15T10:00:00'),
        hearingTime: '10:00 AM',
        courtroom: 'High Court - Room 101',
        purpose: 'Pre-trial hearing and arguments',
        status: 'Scheduled',
        notes: 'Both parties to submit their witness statements'
      },
      {
        caseId: savedCases[1]._id,
        judgeId: savedJudges[1]._id,
        hearingDate: new Date('2026-04-10T02:00:00'),
        hearingTime: '2:00 PM',
        courtroom: 'District Court - Room 205',
        purpose: 'Cross-examination of witnesses',
        status: 'Scheduled',
        notes: 'Criminal proceedings - strict procedure to be followed'
      },
      {
        caseId: savedCases[2]._id,
        judgeId: savedJudges[2]._id,
        hearingDate: new Date('2026-04-20T11:00:00'),
        hearingTime: '11:00 AM',
        courtroom: 'Family Court - Room 302',
        purpose: 'Custody and maintenance hearing',
        status: 'Scheduled',
        notes: 'Child custody to be discussed at length'
      },
      {
        caseId: savedCases[3]._id,
        judgeId: savedJudges[3]._id,
        hearingDate: new Date('2026-04-12T03:00:00'),
        hearingTime: '3:00 PM',
        courtroom: 'Corporate Court - Room 401',
        purpose: 'Shareholder agreement discussion',
        status: 'Scheduled',
        notes: 'All stakeholders must be present'
      },
      {
        caseId: savedCases[4]._id,
        judgeId: savedJudges[0]._id,
        hearingDate: new Date('2026-04-25T09:30:00'),
        hearingTime: '9:30 AM',
        courtroom: 'High Court - Room 101',
        purpose: 'Property verification and witness examination',
        status: 'Scheduled',
        notes: 'Site visit may be required'
      },
      {
        caseId: savedCases[0]._id,
        judgeId: savedJudges[0]._id,
        hearingDate: new Date('2026-05-10T10:00:00'),
        hearingTime: '10:00 AM',
        courtroom: 'High Court - Room 101',
        purpose: 'Final arguments and judgment deliberation',
        status: 'Scheduled',
        notes: 'Counsels to present final submissions'
      },
      {
        caseId: savedCases[5]._id,
        judgeId: savedJudges[5]._id,
        hearingDate: new Date('2026-04-18T01:30:00'),
        hearingTime: '1:30 PM',
        courtroom: 'District Court - Room 210',
        purpose: 'Criminal prosecution hearing',
        status: 'Scheduled',
        notes: 'Police evidence presentation'
      },
      {
        caseId: savedCases[6]._id,
        judgeId: savedJudges[3]._id,
        hearingDate: new Date('2026-04-22T02:30:00'),
        hearingTime: '2:30 PM',
        courtroom: 'Corporate Court - Room 402',
        purpose: 'Patent dispute resolution',
        status: 'Scheduled',
        notes: 'Judgment awaited'
      },
      {
        caseId: savedCases[7]._id,
        judgeId: savedJudges[7]._id,
        hearingDate: new Date('2026-04-28T10:30:00'),
        hearingTime: '10:30 AM',
        courtroom: 'Family Court - Room 305',
        purpose: 'Settlement conference',
        status: 'Scheduled',
        notes: 'Attempt amicable settlement'
      },
      {
        caseId: savedCases[8]._id,
        judgeId: savedJudges[4]._id,
        hearingDate: new Date('2026-04-16T03:00:00'),
        hearingTime: '3:00 PM',
        courtroom: 'High Court - Room 205',
        purpose: 'Construction defect inspection',
        status: 'Scheduled',
        notes: 'Technical expert to be present'
      },
      {
        caseId: savedCases[9]._id,
        judgeId: savedJudges[8]._id,
        hearingDate: new Date('2026-04-14T11:00:00'),
        hearingTime: '11:00 AM',
        courtroom: 'District Court - Room 215',
        purpose: 'Drug trial preliminary hearing',
        status: 'Scheduled',
        notes: 'All evidence to be presented'
      },
      {
        caseId: savedCases[10]._id,
        judgeId: savedJudges[9]._id,
        hearingDate: new Date('2026-05-05T02:00:00'),
        hearingTime: '2:00 PM',
        courtroom: 'Corporate Court - Room 403',
        purpose: 'Loan recovery negotiation',
        status: 'Scheduled',
        notes: 'Bank representative and debtor both required'
      },
      {
        caseId: savedCases[11]._id,
        judgeId: savedJudges[0]._id,
        hearingDate: new Date('2026-05-02T09:00:00'),
        hearingTime: '9:00 AM',
        courtroom: 'High Court - Room 102',
        purpose: 'Eviction notice validation',
        status: 'Scheduled',
        notes: 'Property documentation required'
      },
      {
        caseId: savedCases[1]._id,
        judgeId: savedJudges[1]._id,
        hearingDate: new Date('2026-05-08T01:00:00'),
        hearingTime: '1:00 PM',
        courtroom: 'District Court - Room 206',
        purpose: 'Victim statement and police report review',
        status: 'Scheduled',
        notes: 'Criminal procedure to be followed strictly'
      },
      {
        caseId: savedCases[2]._id,
        judgeId: savedJudges[2]._id,
        hearingDate: new Date('2026-05-15T04:00:00'),
        hearingTime: '4:00 PM',
        courtroom: 'Family Court - Room 301',
        purpose: 'Child custody final determination',
        status: 'Scheduled',
        notes: 'Child welfare priority'
      },
      {
        caseId: savedCases[3]._id,
        judgeId: savedJudges[3]._id,
        hearingDate: new Date('2026-05-20T03:30:00'),
        hearingTime: '3:30 PM',
        courtroom: 'Corporate Court - Room 404',
        purpose: 'Final merger adjudication',
        status: 'Scheduled',
        notes: 'All parties required'
      },
      {
        caseId: savedCases[4]._id,
        judgeId: savedJudges[0]._id,
        hearingDate: new Date('2026-05-28T10:00:00'),
        hearingTime: '10:00 AM',
        courtroom: 'High Court - Room 103',
        purpose: 'Property boundary demarcation order',
        status: 'Scheduled',
        notes: 'Surveyor to present boundary report'
      }
    ];

    for (const hearingData of hearings) {
      const existing = await Hearing.findOne({ 
        caseId: hearingData.caseId, 
        hearingDate: hearingData.hearingDate 
      });
      if (!existing) {
        const hearing = await Hearing.create(hearingData);
        console.log(`✅ Hearing created for Case: ${hearingData.caseId} on ${hearingData.hearingDate.toDateString()}`);
      } else {
        console.log(`⚠️ Hearing already exists`);
      }
    }

    // ✅ SEED ADMINS
    const admins = [
      {
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: 'superadmin123',
        role: 'superadmin'
      },
      {
        name: 'Clerk Admin',
        email: 'clerk@gmail.com',
        password: 'clerk123',
        role: 'clerk'
      }
    ];

    for (const adminData of admins) {
      const existing = await Admin.findOne({ email: adminData.email });
      if (!existing) {
        const admin = new Admin(adminData);
        await admin.save();
        console.log(`✅ Admin created: ${adminData.email}`);
      } else {
        console.log(`⚠️ Admin already exists: ${adminData.email}`);
      }
    }

    console.log('\n📋 Test Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('SuperAdmin:');
    console.log('  Email: superadmin@gmail.com');
    console.log('  Password: superadmin123');
    console.log('  Role: superadmin (Full access)');
    console.log('\nClerk:');
    console.log('  Email: clerk@gmail.com');
    console.log('  Password: clerk123');
    console.log('  Role: clerk (Limited access)');
    console.log('═══════════════════════════════════════\n');

    console.log('✅ All data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
