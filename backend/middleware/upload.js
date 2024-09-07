const path = require('path');
const multer = require('multer');
const { generateUniqueCode } = require('../utils/fileUtils');

// Define the storage strategy
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../uploads')); // Save to the uploads folder
    },
    filename: function (req, file, callback) {
        const uniqueCode = generateUniqueCode(); // Generate unique code for the file
        const ext = path.extname(file.originalname); // Get the file extension
        callback(null, `${uniqueCode}${ext}`); // Save file with unique code and extension
    },
});

// Allow any file type
const fileFilter = (req, file, callback) => {
    // No filtering, accept any file type
    callback(null, true);
};

// Create the multer upload instance with specified settings
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // Set size limit to 10 MB (optional, adjust if needed)
    },
});

module.exports = upload;
