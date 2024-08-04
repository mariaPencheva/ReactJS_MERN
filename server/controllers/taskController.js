const { Task } = require("../models/Task");
const { User } = require("../models/User");
const { taskSchemaIsValid } = require("../utils/validationSchemas");

const createTask = async (req, res) => {
  const { name, description, deadline } = req.body;
  const { error } = taskSchemaIsValid.validate(req.body);

  if (!req.user || !req.user._id) {
    return res.status(401).send("Unauthorized: User not found");
  }

  if (!name) {
    return res.status(400).json({ message: "From server: Name is required" });
  } else if (!description) {
    return res
      .status(400)
      .json({ message: "From server: Description is required" });
  } else if (!deadline) {
    return res
      .status(400)
      .json({ message: "From server: Deadline is required" });
  }

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const parsedDeadline = new Date(deadline);

  if (isNaN(parsedDeadline.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send("Unauthorized: User not found");
    }

    const task = new Task({
      name,
      description,
      image: req.file ? req.file.filename : null,
      deadline: parsedDeadline,
      createdBy: req.user._id,
    });

    await task.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdTasks: task._id },
    });

    res.status(201).send(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).send("Error creating task");
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "username")
      .populate("takenBy", "username")
      .populate("completedBy", "username");

    res.json(tasks);
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
};

const takeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).json({ message: "User or Task not found" });
    }

    if (task.takenBy) {
      return res.status(400).json({ message: "Task is already taken" });
    }

    task.takenBy = userId;
    user.takenTasks.push(taskId);

    await user.save();
    await task.save();

    const populatedTask = await Task.findById(taskId)
      .populate("createdBy", "username email")
      .populate("takenBy", "username email")
      .populate("completedBy", "id username");

    res.json(populatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error taking task");
  }
};

const completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({ message: "Task or User not found" });
    }

    if (task.completed) {
      return res.status(400).json({ message: "Task is already completed" });
    }

    if (!task.takenBy || !task.takenBy.equals(userId)) {
      return res.status(400).json({ message: "You have not taken this task" });
    }

    task.completed = true;
    task.completedBy = userId;

    user.takenTasks = user.takenTasks.filter((t) => !t.equals(taskId));
    user.completedTasks.push(taskId);

    const creator = await User.findById(task.createdBy);

    if (creator) {
      creator.createdTasks = creator.createdTasks.filter(t => !t.equals(taskId));
      creator.archivedTasks.push(taskId);
      await creator.save();
    }

    await task.save();
    await user.save();

    const populatedTask = await Task.findById(taskId)
      .populate("createdBy", "username email")
      .populate("takenBy", "username email")
      .populate("completedBy", "username email");

    if (populatedTask.completedBy) {
      populatedTask.completedBy = {
        id: populatedTask.completedBy._id,
        username: populatedTask.completedBy.username,
      };
    }

    res.json(populatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error completing task");
  }
};

const getCompletedTasks = async (req, res) => {
  const userId = req.user._id;

  try {
    const tasks = await Task.find({
      completed: true,
      completedBy: userId,
    })
      .populate("createdBy", "username email")
      .populate("takenBy", "username email")
      .populate("completedBy", "username");

    tasks.forEach((task) => {
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
    res.status(500).send("Error fetching completed tasks");
  }
};

const getArchivedTasks = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const tasks = await Task.find({
        createdBy: userId,
        completed: true
      })
      .populate("createdBy", "username email")
      .populate('completedBy', 'username email');
  
      const archivedTasks = tasks.filter(task => !task.completedBy || !task.completedBy._id.equals(userId));
  
      res.json(archivedTasks);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving archived tasks");
    }
  };
  

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
        image: image || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }

    if (!updatedTask.createdBy.equals(req.user._id)) {
      return res.status(403).send("You did not create this task");
    }

    res.send("Task updated");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error updating task");
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    if (!task.createdBy.equals(req.user._id)) {
      return res.status(403).send("You did not create this task");
    }

    res.send("Task deleted");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error deleting task");
  }
};

const getCreatedTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ createdBy: userId }).populate(
      "createdBy",
      "username"
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getTakenTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ takenBy: userId })
      .populate("createdBy", "username email")
      .populate("takenBy", "username email")
      .populate("completedBy", "id username");

    res.json(tasks);
  } catch (err) {
    res.status(500).send("Error fetching taken tasks");
  }
};

const getTaskDetails = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId)
      .populate("createdBy", "id username")
      .populate("takenBy", "id username")
      .populate("completedBy", "id username");

    if (!task) return res.status(404).send("Task not found");
    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).send("Error fetching task");
  }
};

const home = async (req, res) => {
  res.status(200).json({ message: "Welcome to the home page!" });
};

const catalog = async (req, res) => {
  try {
    const tasks = await Task.find({ completed: false })
      .populate("createdBy", "username")
      .populate("takenBy", "username")
      .populate("completedBy", "username");

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks SERVER :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTask,
  getTasks,
  takeTask,
  completeTask,
  getCompletedTasks,
  getArchivedTasks,
  updateTask,
  deleteTask,
  getCreatedTasks,
  getTakenTasks,
  getTaskDetails,
  home,
  catalog,
};
