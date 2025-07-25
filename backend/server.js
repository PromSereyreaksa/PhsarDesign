import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';

import reviewRoutes from './routes/review.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Import routes
// import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import clientRoutes from './routes/client.routes.js';
import freelancerRoutes from './routes/freelancer.routes.js';
import projectRoutes from './routes/project.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';

// Import middleware
import errorHandler from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/freelancers', freelancerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

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
        
        // Sync database models
        await sequelize.sync({ alter: true });
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
