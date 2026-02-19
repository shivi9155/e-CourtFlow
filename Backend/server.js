// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');

// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/public', require('./routes/publicRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));


// const PORT = process.env.PORT || 5000;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

app.use('/api', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));