const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;