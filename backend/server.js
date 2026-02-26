const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Setup (Crucial for Cookies)
// During development FRONTEND_URL is set to localhost; on Vercel we
// can use the automatically provided VERCEL_URL environment variable.
const frontendOrigin =
  process.env.FRONTEND_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:3000';

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true, // allow cookies
  })
);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 404 Handler
// in production the frontend will handle unknown routes, so serve index.html
// On Vercel we rely on the static-build and routing defined in vercel.json
// therefore the express app never sees frontend requests. The guard below
// ensures we only try to read from ../frontend/dist during a local or
// Heroku‑style deployment where the build output actually lives next to the
// server code.
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
} else if (!process.env.VERCEL) {
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
  });
} else {
  // When running on Vercel the routing layer will handle 404s
  app.use((req, res, next) => {
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// In a serverless environment (Vercel) we export the app instead of
// calling listen directly. The listen call is only executed when the
// file is run directly (e.g. `node server.js` during local development).

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
