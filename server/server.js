const cors = require('cors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const http = require('http');
// require('dotenv').config();

const app = express();
const port = 3000;
const secret = '5up3r_secr3t';


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(cookieParser(secret));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/DB-TEST-NEW')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


function createToken(userData) {
    const payload = {
        _id: userData._id,
        username: userData.username,
        email: userData.email,
    };

    const token = jwt.sign(payload, secret, {
        expiresIn: '30d'
    });

    console.log('Token from server is:', token);
    return token;
}

function verifyToken(token) {
    try {
        const data = jwt.verify(token, secret);
        return data;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log('No authorization header');
        return res.sendStatus(401);
    }

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log('No token found');
        return res.sendStatus(401);
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        console.log('Decoded token is:', decoded);
        next();
    } catch (err) {
        // console.error('Invalid token:', err);
        res.status(403).send('Invalid token');
    }
};

// multer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);  // Use the existing 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Use the current date and time to generate a unique filename
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        const fileName = `${name}-${timestamp}${ext}`;
        cb(null, fileName);
    }
});

// Create multer instance with storage and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Function to check file type
const checkFileType = function (file, cb) {
    // Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;

    // Check extension and MIME type
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype.toLowerCase());

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb(new Error("Error: You can upload images only!"));
    }
};

// Define route for uploading files
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        res.send('File uploaded successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(uploadDir));

const { Schema, model, Types } = mongoose;

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
    },
    createdTasks: [{
        type: Types.ObjectId,
        ref: 'Task'
    }],
    assignedTasks: [{
        type: Types.ObjectId,
        ref: 'Task'
    }]
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

// Routes
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
            
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });

        await user.save();

        const token = createToken(user);
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

        res.status(201).json({ token, user });

    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      console.log(user, req.body);
  
      if (!user) {
        return res.status(400).send('Wrong email');
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).send('Password does not match');
      }
  
      const token = createToken({ _id: user._id, email: user.email, username: user.username });
  
      res.json({
        token,
        user: {
          username: user.username,
          id: user._id,
          createdTasks: user.createdTasks,
          assignedTasks: user.assignedTasks
        }
      });
    } catch (error) {
      console.error('Error during signin:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

app.get('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('username');

        if (!user) return res.status(404).send('User not found');
        res.json({ username: user.username });
    } catch (error) {
        res.status(500).send('Error fetching user data');
    }
});

// Task Controllers
const createTask = async (req, res) => {
    try {

        if (!req.user || !req.user._id) {
            return res.status(401).send('Unauthorized: User not found');
        }

        const task = new Task({
        name: req.body.name,
        description: req.body.description,
        image: req.file ? req.file.filename : null,
        deadline: new Date(req.body.deadline),
        createdBy: req.user._id,
        });

        await task.save();
        res.status(201).send('Task created');
    } catch(err) {
        console.error('Error creating task:', err);
        res.status(500).send('Error creating task');
}};

app.post('/api/tasks', authMiddleware, upload.single('image'), createTask);


const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('createdBy', 'username')  
            .populate('takenBy', 'username');  
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching tasks');
    }
};

app.get('/api/tasks', getTasks);

const takeTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.takenBy = userId;
        await task.save();

        const populatedTask = await Task.findById(taskId)
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email');

        res.json(populatedTask);
    } catch (err) {
        res.status(500).send('Error taking task');
    }
};

app.post('/api/tasks/:id/take', authMiddleware, takeTask);

const completeTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task.takenBy.equals(req.user._id)) {
        return res.status(403).send('You did not take this task');
    }
    task.completed = true;
    await task.save();
    res.send('Task completed');
};

app.post('/api/tasks/:id/complete', authMiddleware, completeTask);

const getCompletedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ completed: true })
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email');
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching completed tasks');
    }
};

app.get('/api/tasks/completed', authMiddleware, getCompletedTasks);

const updateTask = async (req, res) => {
    try {
        const { name, description, deadline } = req.body;
        const image = req.file ? req.file.filename : undefined;


        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { 
                name: name || undefined,
                description: description || undefined,
                deadline: deadline ? new Date(deadline) : undefined,
                image: image || undefined
            },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        console.log('Updated Task:', updatedTask);

        if (!updatedTask.createdBy.equals(req.user._id)) {
            return res.status(403).send('You did not create this task');
        }

        res.send('Task updated');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error updating task');
    }

   
};

app.put('/api/tasks/:id', authMiddleware, upload.single('image'), updateTask);

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send('Task not found');
        }

        if (!task.createdBy.equals(req.user._id)) {
            return res.status(403).send('You did not create this task');
        }

        res.send('Task deleted');
        
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Error deleting task');
    }
};

app.delete('/api/tasks/:id', authMiddleware, deleteTask);

app.get('/api/tasks/created', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id }).populate('createdBy', 'username');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const getTakenTasks = async (req, res) => {
    try {
        const userId = req.user._id;

        const tasks = await Task.find({ takenBy: userId })
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email');

        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching taken tasks');
    }
};

app.get('/api/tasks/taken', authMiddleware, getTakenTasks);

//details
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        .populate('createdBy', 'username')  
        .populate('takenBy', 'username'); 
        if (!task) return res.status(404).send('Task not found');
        res.json(task);
    } catch (err) {
        console.error('Error fetching task:', err);
        res.status(500).send('Error fetching task');
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
