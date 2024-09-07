require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const connectDb = require('./config/db');
const ORIGIN = process.env.CORS_ORIGINS || '*';
const albumcontroller = require('./controllers/fileController');

app.use(express.json());
app.use(
    cors({
        origin: ORIGIN,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

const { register, login } = require('./controllers/auth.controller');
const usercontroller = require('./controllers/user.controller');

app.post('/register', register);
app.use('/user', usercontroller);
app.post('/login', login);
app.use('/albums', albumcontroller); // Make sure this is defined

const PORT = process.env.PORT || 8000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
