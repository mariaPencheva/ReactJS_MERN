const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/DB-TEST-TaskBoard')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});