const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const notificationRoutes = require('./routes/notification.routes');
const activityLogRoutes = require('./routes/activitylog.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');

dotenv.config();

const app = express();
const promClient = require('prom-client');

// Initialize default metrics collection
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

app.use(cors());
app.use(express.json());

// Expose metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Student Management System API is running', status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/logs', activityLogRoutes);
app.use('/api/categories', categoryRoutes);

module.exports = app;