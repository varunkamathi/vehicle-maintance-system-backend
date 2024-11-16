// api/routes/auth.js
import express from 'express';
import authMiddleware from '../middlewares/auth.middlewares.js';
const router = express.Router();
import { registerUser, loginUser, getProfile} from '../controllers/auth.controller.js'; // Import the controller
import {addVehicle, getVehicles } from '../controllers/vehicle.controller.js'

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.get('/profile',  authMiddleware, getProfile);

// POST route to add a vehicle
router.post('/add', authMiddleware, async (req, res) => {
    console.log('Authenticated User Data:', req.user); // Debug log
    await addVehicle(req, res); // Call the controller function
  });

// GET route to fetch user vehicles
router.get('/user-vehicles', authMiddleware ,getVehicles);




export default router;