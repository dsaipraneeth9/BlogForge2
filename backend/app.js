import express from 'express';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

db();

let app = express();

let limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(limiter);

const blogLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Higher limit for blog requests
    message: 'Too many blog requests from this IP, please try again later.'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/blog", blogLimiter, blogRoutes);
app.use("/api/notifications", notificationRoutes); 

app.use(errorMiddleware);

export default app;