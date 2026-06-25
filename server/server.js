import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

// Handle Uncaught Exceptions globally
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Load Environment Variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

// Fetch Port configuration
const PORT = process.env.PORT || 5000;

// Start Listening for HTTP requests
const server = app.listen(PORT, () => {
  console.log('\n=== Startup Report ===');
  console.log(`✓ Backend Running`);
  console.log(`✓ Port Listening: ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  const allowedOrigin = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
  console.log(`✓ Allowed Origin: ${allowedOrigin}`);
  console.log(`✓ Auth Route Registered: /api/v1/auth/register`);
  console.log(`✓ Health Route Registered: /api/v1/health`);
  console.log(`✓ Registered Base Routes: /api/v1/* (auth, health, accounts, transactions, admin, dashboard)`);
  console.log('======================\n');
});

// Handle Unhandled Promise Rejections globally
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful Shutdown
const shutdownGracefully = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown if graceful shutdown takes too long (e.g. 10s)
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));
