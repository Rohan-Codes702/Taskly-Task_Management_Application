// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Setup
const frontendOrigin =
  process.env.FRONTEND_URL ; // Vercel or local dev

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true, // allow cookies
  })
);

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 404 Handler for unknown routes (API-only)
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server (only when run locally / on Render)
const PORT = process.env.PORT;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app (for serverless platforms like Vercel if needed)
module.exports = app;