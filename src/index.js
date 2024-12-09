// Import necessary modules
import express from 'express';
import cors from 'cors'; // For handling Cross-Origin requests
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import cookieParser from 'cookie-parser';


// Load environment variables from .env file
dotenv.config({
    path : "./env"
});

// Initialize the app
const app = express();

// Middleware
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
  };
app.use(express.json()); // Parse JSON bodies
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(cookieParser());


// Connect to MongoDB

connectDB()
/*mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));*/

// Basic route for testing


// Import routes
import authRoutes from './routes/auth.routes.js'; // Import the auth routes
app.use('/api/users', authRoutes);
import vehicleRoutes from './routes/vehicle.routes.js'; // Use the vehicle route
app.use("/api/vehicles", vehicleRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
