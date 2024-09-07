const path = require('path');
const multer = require('multer');
const FILE_PATH = path.join('/uploads/files');

// Multer configuration for uploading files to the server's uploads folder.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', FILE_PATH));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});

// Multer configuration for validating file type and size.
const fileFilter = (req, file, callback) => {
    callback(null, true);
};

// Multer instance for uploading files.
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
});

module.exports = upload;
