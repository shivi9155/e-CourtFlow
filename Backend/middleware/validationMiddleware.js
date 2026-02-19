const { body, validationResult } = require('express-validator');

const validateCase = [
  body('caseNumber').notEmpty().withMessage('Case number required'),
  body('title').notEmpty(),
  body('parties.petitioner').notEmpty(),
  body('parties.respondent').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
// Similarly for other validations
module.exports = { validateCase };