const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/multerUtils');
const { createTask, getTasks, takeTask, completeTask, getCompletedTasks, getArchivedTasks, updateTask, deleteTask, getCreatedTasks, getTakenTasks, getTaskDetails, home, catalog } = require('../controllers/taskController');

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createTask);
router.get('/', getTasks);
router.post('/:id/take', authMiddleware, takeTask);
router.post('/:id/complete', authMiddleware, completeTask);
router.get('/archived', authMiddleware, getArchivedTasks);

router.get('/completed', authMiddleware, getCompletedTasks);
router.put('/:id', authMiddleware, upload.single('image'), updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.get('/created', authMiddleware, getCreatedTasks);
router.get('/taken', authMiddleware, getTakenTasks);
router.get('/home', home);
router.get('/catalog', catalog);
router.get('/:id', getTaskDetails);

module.exports = router;
