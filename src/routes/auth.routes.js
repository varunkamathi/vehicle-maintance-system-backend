// api/routes/auth.js
import express from 'express';
const router = express.Router();
import { registerUser, loginUser } from '../controllers/auth.controller.js'; // Import the controller

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

export default router;