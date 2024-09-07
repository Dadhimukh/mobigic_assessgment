require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const URI = process.env.MONGODB_URI;
mongoose.connect(URI);

const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Connected Successfully to DB');
    } catch {
        console.error('Error connecting to DB:', err);
        process.exit(0);
    }
};

module.exports = connectDb;
