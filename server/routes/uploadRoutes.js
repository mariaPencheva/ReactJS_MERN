const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/multerUtils');

const router = express.Router();

router.post('/:id/upload', authMiddleware, upload.single('file'), (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;