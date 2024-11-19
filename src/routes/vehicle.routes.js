import { Router } from 'express';
import { addVehicle, getVehicles } from '../controllers/vehicle.controller.js';
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Apply the verifyJWT middleware to all routes in this file

// Route to add a vehicle
router.post("/add", verifyJWT,addVehicle);

// Route to get all vehicles for the logged-in user
router.get("/get/:userId", verifyJWT , getVehicles);

export default router;
