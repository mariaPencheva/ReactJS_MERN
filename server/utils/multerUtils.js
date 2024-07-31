const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        const fileName = `${name}-${timestamp}${ext}`;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, //10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype.toLowerCase());

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb(new Error("Error: You can upload images only!"));
    }
}

module.exports = { upload };