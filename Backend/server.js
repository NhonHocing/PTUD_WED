const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Trust proxy (important for Render to get correct protocol from x-forwarded-proto header)
app.set('trust proxy', true);

// Middleware
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, Swagger UI, or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['*'];
    
    // Allow all origins in development or if CORS_ORIGIN is '*'
    if (allowedOrigins.includes('*') || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
// Function to get current server URL from request
const getCurrentServerUrl = (req) => {
  // If API_URL is set, use it (ensure HTTPS)
  if (process.env.API_URL) {
    return process.env.API_URL.replace(/^http:/, 'https:');
  }
  
  // In production, always use HTTPS
  if (process.env.NODE_ENV === 'production') {
    return 'https://ptud-wed.onrender.com';
  }
  
  // In development, construct from request
  // Check if request came over HTTPS (e.g., through proxy)
  const forwardedProto = req.get('x-forwarded-proto');
  const protocol = forwardedProto || req.protocol;
  const host = req.get('host');
  
  // Force HTTPS if:
  // 1. On Render domain (onrender.com)
  // 2. x-forwarded-proto is https
  // 3. Original request was HTTPS
  if (host && (host.includes('onrender.com') || forwardedProto === 'https' || req.secure)) {
    return `https://${host}`;
  }
  
  // For localhost, use the protocol from request
  return `${protocol}://${host}`;
};

// Custom Swagger setup to use current server URL
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', (req, res, next) => {
  const currentUrl = getCurrentServerUrl(req);
  
  // Clone swagger spec and update servers
  const swaggerSpecWithUrl = JSON.parse(JSON.stringify(swaggerSpec));
  
  // Ensure URL uses HTTPS for production domains
  let serverUrl = currentUrl;
  if (serverUrl.includes('onrender.com') || serverUrl.includes('vercel.app') || process.env.NODE_ENV === 'production') {
    serverUrl = serverUrl.replace(/^http:/, 'https:');
  }
  
  swaggerSpecWithUrl.servers = [
    {
      url: serverUrl,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ];
  
  // Add alternative server for development
  if (process.env.NODE_ENV !== 'production') {
    swaggerSpecWithUrl.servers.push({
      url: 'https://ptud-wed.onrender.com',
      description: 'Production server (Render)',
    });
  }
  
  const swaggerUiHandler = swaggerUi.setup(swaggerSpecWithUrl, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Library Management API Documentation',
  });
  
  swaggerUiHandler(req, res, next);
});

// Routes
app.use('/api', require('./routes'));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

