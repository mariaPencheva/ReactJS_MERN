const { Schema, model, Types } = require('mongoose');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const secret = '54p3r 53cr3t jwt';

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middleware CORS and JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/task-board')
    .then(() => {
    console.log('MongoDB connected')})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
const upload = multer({ storage: storage });

//middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).send('Invalid token');
        }
        req.user = decoded;
        next();
      });
    } else {
      res.status(401).send('Token required');
    }
  };

// models
 const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },    
    password: {
        type: String,
        required: true
    }
 });

const User = model('User', userSchema);

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    takenBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    }, 
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = model('Task', taskSchema);

// register
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });

        await user.save();
        res.status(201).send('User registered');

    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// login
app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(401).send('Invalid email or password');
    }
});

//profile page
app.get('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.json({ username: user.username });
    } catch (error) {
      res.status(500).send('Error fetching user data');
    }
  });

// controllers for tasks
const createTask = async (req, res) => {
    const task = new Task({
      name: req.body.name,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
      deadline: new Date(req.body.deadline),
      createdBy: req.user.id,
    });
    await task.save();
    res.status(201).send('Task created');
  };
  
const getTasks = async (req, res) => {
    const tasks = await Task.find().populate('createdBy', 'username email').populate('takenBy', 'username email');
    res.json(tasks);
};
  
const takeTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
        if (task.takenBy) {
            return res.status(400).send('Task already taken');
        }
    task.takenBy = req.user.id;
    await task.save();
res.send('Task taken');
};
  
const completeTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
        if (!task.takenBy.equals(req.user.id)) {
            return res.status(403).send('You did not take this task');
        }
    task.completed = true;
    await task.save();
    res.send('Task completed');
};

const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
        if (!task.createdBy.equals(req.user.id)) {
            return res.status(403).send('You did not create this task');
        }
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.deadline = req.body.deadline ? new Date(req.body.deadline) : task.deadline;
    task.image = req.file ? req.file.filename : task.image;
    await task.save();
    res.send('Task updated');
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
        if (!task.createdBy.equals(req.user.id)) {
            return res.status(403).send('You did not create this task');
        }
    await task.remove();
    res.send('Task deleted');
};

app.post('/api/tasks', authMiddleware, upload.single('image'), createTask);
app.get('/api/tasks', getTasks);
app.post('/api/tasks/:id/take', authMiddleware, takeTask);
app.post('/api/tasks/:id/complete', authMiddleware, completeTask);
app.put('/api/tasks/:id', authMiddleware, upload.single('image'), updateTask);
app.delete('/api/tasks/:id', authMiddleware, deleteTask);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
