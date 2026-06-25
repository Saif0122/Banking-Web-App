import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middlewares/rateLimit.js';

import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

// Set HTTP Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:3000'],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Enable CORS
const rawOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000', 'https://banking-web-app-theta.vercel.app'];
const allowedOrigins = rawOrigins.map(origin => origin.trim().replace(/\/+$/, ''));

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // remove trailing slash from incoming origin just in case, though browsers don't usually send it
    const cleanOrigin = origin.replace(/\/+$/, '');
    
    if (allowedOrigins.indexOf(cleanOrigin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Compress all responses
app.use(compression());

// Parse cookie headers
app.use(cookieParser());

// Global API rate limiting
app.use('/api', apiLimiter);

// JSON body parser
app.use(express.json());

// URL encoded parser
app.use(express.urlencoded({ extended: true }));

// Mount API base routes
app.use('/api/v1', routes);

// Handle Undefined Route fallbacks (404)
app.use(notFoundHandler);

// Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
