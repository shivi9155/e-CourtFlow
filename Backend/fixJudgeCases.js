require('dotenv').config();
const mongoose = require('mongoose');
const Case = require('./models/Case');
const Judge = require('./models/Judge');

const fixJudgeCases = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    console.log('\n🔧 Fixing Judge-Case Relationships...\n');

    // Get all cases
    const allCases = await Case.find();
    console.log(`Found ${allCases.length} cases`);

    for (const caseItem of allCases) {
      if (caseItem.assignedJudge) {
        // Clear judge's assignedCases first
        await Judge.findByIdAndUpdate(
          caseItem.assignedJudge,
          { $pull: { assignedCases: caseItem._id } }
        );

        // Add case to judge
        const judge = await Judge.findByIdAndUpdate(
          caseItem.assignedJudge,
          { $addToSet: { assignedCases: caseItem._id } },
          { new: true }
        );
        console.log(`✅ Case ${caseItem.caseNumber} assigned to Judge: ${judge.name}`);
      }
    }

    console.log('\n✅ Judge-Case relationships fixed!\n');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

fixJudgeCases();
