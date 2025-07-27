import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import { sequelize } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import clientRoutes from './routes/client.routes.js';
import artistRoutes from './routes/artist.routes.js';
import commissionRoutes from './routes/commission.routes.js';
import projectRoutes from './routes/project.routes.js';
import reviewRoutes from './routes/review.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import availabilityPostRoutes from './routes/availabilityPost.routes.js';
import jobPostRoutes from './routes/jobPost.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';

// Import middleware
import errorHandler from './middlewares/error.middleware.js';
import { 
  generalLimiter, 
  authLimiter, 
  uploadLimiter,
  securityHeaders, 
  sanitizeInput,
  requestLogger 
} from './middlewares/security.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware (apply first)
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(compression());

// Logging middleware
app.use(morgan('combined'));
app.use(requestLogger);

// Rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/upload/', uploadLimiter);

// Standard middleware
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/availability-posts', availabilityPostRoutes);
app.use('/api/job-posts', jobPostRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'ArtLink Backend is running' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // Sync database models (preserve existing data)
        await sequelize.sync({ force: false });
        console.log('Database models synchronized.');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();
