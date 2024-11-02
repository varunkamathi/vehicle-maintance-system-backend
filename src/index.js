// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';  // If you're using MongoDB
import cors from 'cors'; // For handling Cross-Origin requests
import dotenv from 'dotenv';
import connectDB from './db/index.js';

// Load environment variables from .env file
dotenv.config({
    path : "./env"
});

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB

connectDB()
/*mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));*/

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Import routes
import authRoutes from './routes/auth.routes.js'; // Import the auth routes
app.use('/api/users', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
