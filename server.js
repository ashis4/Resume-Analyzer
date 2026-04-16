const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

// ✅ Proper CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5500",
    "https://gentle-snickerdoodle-3a3b5f.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/analyze', require('./routes/analyzeRoutes'));

app.get('/', (req, res) => {
  res.send('Resume Analyzer API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
