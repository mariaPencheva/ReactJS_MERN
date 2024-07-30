const cors = require('cors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
// const cookieParser = require('cookie-parser');
const http = require('http');
// require('dotenv').config();
const Joi = require('joi');

const app = express();
const port = 3000;

const secret = '5up3r_secr3t_ssecret';


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// app.use(cookieParser(secret));
app.options('*', cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/DB-TEST-TaskBoard')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

//validation with joi - task
const taskSchemaIsValid = Joi.object({
    name: Joi.string().min(5).required().messages({
        'string.base': 'Task name must be a string',
        'string.min': 'Task name must be at least 5 characters long',
        'any.required': 'Task name is required'
    }),
    description: Joi.string().min(10).required().messages({
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 10 characters long',
        'any.required': 'Description is required'
    }),
    deadline: Joi.date().iso().required().messages({
        'date.base': 'Deadline must be a valid date',
        'date.format': 'Deadline must be in ISO format (YYYY-MM-DD)',
        'any.required': 'Deadline is required'
    }),
    image: Joi.string().allow(null, '')
});   

const emailPattern = /^[^\s@]+@[a-z]+\.[a-z]+$/;

//validation with joi - user
const userSchemaIsValid = Joi.object({
    username: Joi.string().min(5).required().messages({
        'string.base': 'Username must be a string',
        'string.min': 'Username must be at least 5 characters long',
        'any.required': 'Username is required'
    }),
    email: Joi.string().pattern(emailPattern).required().messages({
        'string.pattern.base': 'Invalid email address format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    repass: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required'
    })
});

//import data
// const importData = async () => {
//     try {
//         const filePath = path.join(__dirname, 'users.json');
//         const usersData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//         await User.deleteMany({});
//         await Task.deleteMany({});

//         const users = [];

//         for (const userData of usersData) {
//             const user = new User({
//                 username: userData.username,
//                 email: userData.email,
//                 password: userData.password
//             });
//             await user.save();
//             users.push(user); 
//         }

//         for (const userData of usersData) {
//             const user = users.find(u => u.email === userData.email);
//             if (!user) continue;

//             for (const taskData of userData.createdTasks) {
//                 const task = new Task({
//                     name: taskData.name,
//                     description: taskData.description,
//                     image: taskData.image,
//                     deadline: new Date(taskData.deadline),
//                     createdBy: user._id,
//                     completed: taskData.completed
//                 });
//                 await task.save();
//             }
//         }

//         for (const userData of usersData) {
//             const user = users.find(u => u.email === userData.email);
//             if (!user) continue;

//             for (const taskData of userData.createdTasks) {
//                 const task = await Task.findOne({ name: taskData.name, createdBy: user._id });

//                 if (!task) {
//                     continue
//                 };

//                 // if (taskData.completed) {
//                 //     task.completedBy = user._id;
//                 // }
//                 await task.save();
//             }
//         }

//         console.log('from server: Data imported successfully');
//         mongoose.disconnect();
//     } catch (err) {
//         console.error('from server: Error importing data', err);
//         mongoose.disconnect();
//     }
// };
    
function createToken(userData) {
    const payload = {
        _id: userData._id,
        username: userData.username,
        email: userData.email,
    };

    console.log('Creating token with secret:', secret);

    const token = jwt.sign(payload, secret, {
        expiresIn: '30d'
    });

    console.log('Generated token from the server is:', token);
    return token;
}

function verifyToken(token) {
    try {
        const data = jwt.verify(token, secret);
        return data;
    } catch (error) {
        console.error('Error verifying token:', error.message);
        throw new Error('Invalid token');
    }
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.error('No token provided');
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        console.log('Decoded token:', decoded);
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
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

// Server static files from 'uploads' directory
app.use('/uploads', express.static(uploadDir));

const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        // unique: true
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
    completedTasks: [{
        type: Types.ObjectId,
        ref: 'Task'
    }],
    takenTasks: [{
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
    },
    completedBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    }
});

const Task = model('Task', taskSchema);

// Routes
app.post('/api/auth/signup', async (req, res) => {
    console.log('Received signup request:', req.body);

    const { error } = userSchemaIsValid.validate(req.body);

    if (error) {
        console.error('Validation error:', error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    const { username, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
            
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = createToken(user);
        res.status(201).json({ token, user });

    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await User.findOne({ email });
        //   console.log(user, req.body);
    
        if (!user) {
            return res.status(400).send('User does not exist!');
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            return res.status(400).send('Password does not match');
        }
  
        const token = createToken(user);

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                createdTasks: user.createdTasks,
                completedTasks: user.completedTasks,
                takenTasks: user.takenTasks
            }
        });

        } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Server error' });
        }
  });
  

app.get('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('_id username');

        if (!user) {
            return res.status(404).send('User not found')
        };

        res.json({ _id: user._id, username: user.username });
    } catch (error) {
        res.status(500).send('Error fetching user data');
    }
});

// Task Controllers
const createTask = async (req, res) => {
    const { error } = taskSchemaIsValid.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try { 
        
        if (!req.user || !req.user._id) {
            return res.status(401).send('Unauthorized: User not found');
        }
        
        const task = new Task ({ 
            name: req.body.name,
            description: req.body.description,
            image: req.file ? req.file.filename : null,
            deadline: new Date(req.body.deadline),
            createdBy: req.user._id,
        });
        
        await task.save();
        // res.status(201).send('Task created');
        res.status(201).send(task);
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

        const user = await User.findById(userId);
        const task = await Task.findById(taskId);

        if (!user || !task) {
            return res.status(404).json({ message: 'User or Task not found' });
        }

        if (task.takenBy) {
            return res.status(400).json({ message: 'Task is already taken' });
        }

        task.takenBy = userId;
        user.takenTasks.push(taskId);

        await user.save();
        await task.save();

        const populatedTask = await Task.findById(taskId)
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email');

        res.json(populatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error taking task');
    }
};

app.post('/api/tasks/:id/take', authMiddleware, takeTask);

// const completeTask = async (req, res) => {
//     // const task = await Task.findById(req.params.id);
//     // if (!task.takenBy.equals(req.user._id)) {
//     //     return res.status(403).send('You did not take this task');
//     // }
//     // task.completed = true;
//     // await task.save();
//     // res.send('Task completed');

//     const { id } = req.params;
//     const userId = req.user._id;

//     try {
//         const task = await Task.findById(id);

//         if (!task) {
//             return res.status(404).json({ message: 'Task not found' });
//         }

//         task.completed = true;
//         task.completedBy = userId;

//         await task.save();

//         res.status(200).json({ message: 'Task completed', completedBy: userId });
//     } catch (error) {
//         res.status(500).json({ message: 'Error completing task', error });
//     }
// };

const completeTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findById(taskId);
        const user = await User.findById(userId);

        if (!task || !user) {
            return res.status(404).json({ message: 'Task or User not found' });
        }

        if (task.completed) {
            return res.status(400).json({ message: 'Task is already completed' });
        }

        if (!task.takenBy || !task.takenBy.equals(userId)) {
            return res.status(400).json({ message: 'You have not taken this task' });
        }

        task.completed = true;
        task.completedBy = userId;

        user.takenTasks = user.takenTasks.filter(t => !t.equals(taskId));

        await task.save();
        await user.save();

        const populatedTask = await Task.findById(taskId)
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email')
            .populate('completedBy', 'username email');

        res.json(populatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error completing task');
    }
};


app.post('/api/tasks/:id/complete', authMiddleware, completeTask);

const getCompletedTasks = async (req, res) => {
    const userId = req.user._id;

    try {
        const tasks = await Task.find({ completed: true, completedBy: userId })
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email');
        res.json(tasks);
    } catch (err) {
        console.error(`Completed tasks server error: ${err}`);
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

        // console.log('Updated Task:', updatedTask);

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
