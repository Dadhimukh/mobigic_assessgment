// backend/utils/fileUtils.js

// Function to generate a unique 6-digit code
const generateUniqueCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
};

module.exports = { generateUniqueCode };
