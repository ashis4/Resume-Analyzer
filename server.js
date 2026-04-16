const express = require('express');
const cors = require('cors');
const https = require('https');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// ✅ CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Backup manual headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/analyze', require('./routes/analyzeRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('Resume Analyzer API is running');
});

// ✅ Keep Render awake every 10 minutes
setInterval(() => {
  https.get('https://resume-analyzer-backend.onrender.com/', (res) => {
    console.log('Keep-alive ping sent, status:', res.statusCode);
  }).on('error', (err) => {
    console.log('Keep-alive error:', err.message);
  });
}, 10 * 60 * 1000);

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
