# Mobigic Assessment (MERN Stack)

This is a full-stack MERN (MongoDB, Express, React, Node.js) application built for the Mobigic assessment. The project is divided into two main folders: `backend` for the server-side code and `frontend` for the client-side code.

## Project Structure


### Backend

The backend folder contains the server-side code of the project. It includes Express.js as the web framework and MongoDB as the database.

- **Port**: The backend runs on port `8000` by default.
- **Database**: MongoDB is used as the database. Make sure MongoDB is running locally or connected via cloud (e.g., MongoDB Atlas).
- **Environment Variables**: You should add a `.env` file in the backend folder to set up the necessary environment variables (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`).

#### Steps to Run Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   npm install
   npm start
   
#### Steps to Start Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   npm install
   npm run dev
