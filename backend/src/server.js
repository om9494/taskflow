const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev / containerized environments
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (clean and helpful for DevOps logs in Docker/K8s)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TaskFlow API',
    version: '1.0.0',
    documentation: '/api/tasks',
    health: '/api/health'
  });
});

// Mount API routes under /api
app.use('/api', taskRoutes);

// Catch-all 404 handler
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` TaskFlow Backend Server is running!`);
  console.log(` Listening on port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Graceful shutdown for Docker and Kubernetes SIGTERM / SIGINT
const handleShutdown = (signal) => {
  console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = app;
