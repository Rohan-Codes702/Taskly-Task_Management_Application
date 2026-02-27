// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==============================
// CORS Setup
// ==============================
const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://taskly-frontend-neon.vercel.app', // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies
  })
);

// ==============================
// Connect to MongoDB
// ==============================
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI =
  NODE_ENV === 'production'
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV;

connectDB(MONGO_URI);

// ==============================
// API Routes
// ==============================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// ==============================
// 404 Handler for unknown routes
// ==============================
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ==============================
// Start server
// ==============================
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });
}

// Export app (for serverless platforms if needed)
module.exports = app;