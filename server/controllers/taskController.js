const { Task } = require('../models/Task');
const { User } = require('../models/User');
const { taskSchemaIsValid } = require('../utils/validationSchemas');

// Create Task
const createTask = async (req, res) => {
    const { error } = taskSchemaIsValid.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

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
        // res.status(201).send('Task created');
        res.status(201).send(task);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).send('Error creating task');
    }
};

// Get All Tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('createdBy', 'username')  
            .populate('takenBy', 'username')
            .populate('completedBy', 'username');

        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching tasks');
    }
};

// Take Task
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
            .populate('takenBy', 'username email')
            .populate('completedBy', 'id username');

        res.json(populatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error taking task');
    }
};

// Complete Task
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
            .populate('completedBy', 'username');

            if (populatedTask.completedBy) {
                populatedTask.completedBy = {
                    id: populatedTask.completedBy._id,
                    username: populatedTask.completedBy.username,
                };
            }    

        res.json(populatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error completing task');
    }
};

// Get Completed Tasks
const getCompletedTasks = async (req, res) => {
    const userId = req.user._id;

    try {
        const tasks = await Task.find({
            completed: true,
            completedBy: userId
        })
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email')
            .populate('completedBy', 'username');

        // console.log('Tasks:', tasks);    

        tasks.forEach(task => {
            if (task.completedBy) {
                task.completedBy = {
                    id: task.completedBy._id,
                    username: task.completedBy.username,
                };
            }
        });
            
        res.json(tasks);
    } catch (err) {
        console.error(`Completed tasks server error: ${err}`);
        res.status(500).send('Error fetching completed tasks');
    }
};

// Update Task
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

// Delete Task
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

// Get Created Tasks
const getCreatedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id }).populate('createdBy', 'username');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Taken Tasks
const getTakenTasks = async (req, res) => {
    try {
        const userId = req.user._id;

        const tasks = await Task.find({ takenBy: userId })
            .populate('createdBy', 'username email')
            .populate('takenBy', 'username email')
            .populate('completedBy', 'id username');

        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching taken tasks');
    }
};

// Get Task Details
const getTaskDetails = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('createdBy', 'username')  
            .populate('takenBy', 'username')
            .populate('completedBy', 'username');

        if (!task) return res.status(404).send('Task not found');
        res.json(task);
    } catch (err) {
        console.error('Error fetching task:', err);
        res.status(500).send('Error fetching task');
    }
};

const home = async (req, res) => {
    res.status(200).json({ message: 'Welcome to the home page!' });
};

const catalog = async (req, res) => {
    try {
        const tasks = await Task.find({ completed: false });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks SERVER :', error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // res.status(200).json({ message: 'This is the catalog page' });
};


module.exports = {
    createTask,
    getTasks,
    takeTask,
    completeTask,
    getCompletedTasks,
    updateTask,
    deleteTask,
    getCreatedTasks,
    getTakenTasks,
    getTaskDetails,
    home,
    catalog
};
