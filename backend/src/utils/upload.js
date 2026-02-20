const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = 'uploads/';
        if (file.fieldname === 'coverImage' || file.mimetype.startsWith('image/')) {
            uploadDir += 'albums';
        } else if (file.fieldname === 'audioFile' || file.mimetype.startsWith('audio/')) {
            uploadDir += 'tracks';
        }

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/') || file.originalname.match(/\.(mp3|wav|ogg|m4a)$/)) {
        cb(null, true);
    } else {
        cb(new Error('Only images and audio files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // Increased to 20MB for audio files
    },
});

module.exports = upload;
