import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import articlesRoutes from './routes/articles.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import tagsRoutes from './routes/tags.routes.js';

const app = express();

// Debug CORS config
console.log('🔧 CORS Origin config:', config.corsOrigin, typeof config.corsOrigin);

// Middleware
app.use(
  cors({
    origin: config.corsOrigin, // Can be '*' for dev or array of origins for prod
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
// With stripPrefix disabled, Coolify keeps the /api prefix
// domain.com/api/articles → container receives /api/articles
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    errors: [
      {
        status: '404',
        title: 'Not Found',
        detail: `Route ${req.method} ${req.path} not found`,
      },
    ],
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 API Server running on http://localhost:${config.port}`);
  console.log(`📖 Health check: http://localhost:${config.port}/health`);
});
