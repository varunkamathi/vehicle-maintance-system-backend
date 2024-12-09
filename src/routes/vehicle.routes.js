import { Router } from 'express';
import { addVehicle, getVehicles } from '../controllers/vehicle.controller.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { asyncHandler } from '../util/asyncHandler.js';
import {Vehicle} from '../model/vehicle.model.js'; // Import the Vehicle model

// Load environment variables from .env file
dotenv.config();

const router = Router();

// Middleware to verify JWT for all routes


/**
 * Route to add a new vehicle to the database
 * Endpoint: POST /api/vehicles/add
 */
router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const { ownerName, vin, vrn, userId } = req.body;

    if (!ownerName || !vin || !userId) {
      return res.status(400).json({ error: 'Owner Name, VIN, and User ID are required.' });
    }

    const newVehicle = new Vehicle({ ownerName, vin, vrn, userId });

    try {
      const savedVehicle = await newVehicle.save();
      res.status(201).json({ message: 'Vehicle added successfully', vehicle: savedVehicle });
    } catch (error) {
      console.error('Error saving vehicle:', error.message);
      res.status(500).json({ error: 'Internal server error while saving the vehicle.' });
    }
  })
);

/**
 * Route to get all vehicles for the logged-in user
 * Endpoint: GET /api/vehicles/get/:userId
 */
router.get(
  '/get/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
      const vehicles = await Vehicle.find({ userId });
      // const vehicles = await Vehicle.find({ userId }).sort({ createdAt: 1 });
      if (!vehicles || vehicles.length === 0) {
        return res.status(404).json({ error: 'No vehicles found for this user.' });
      }
      res.status(200).json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
      res.status(500).json({ error: 'Internal server error while fetching vehicles.' });
    }
  })
);

/**
 * Route to delete a vehicle
 * Endpoint: DELETE /api/vehicles/:id
 */
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const result = await Vehicle.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.status(200).json({ message: 'Vehicle deleted successfully', result });
    } catch (error) {
      console.error('Error deleting vehicle:', error.message);
      res.status(500).json({ error: 'Internal server error while deleting vehicle.' });
    }
  })
);

/**
 * Route to fetch vehicle details from the RTO API
 * Endpoint: GET /api/vehicles/rto/lookup/:vehicle_no
 */

// add vehical
router.get(
  '/rto/lookup',
  asyncHandler(async (req, res) => {
    const { vehicle_no ,ownerName,userId} = req.query;

    console.log("vehicle number is",vehicle_no);
    
    const apiKey = process.env.RTO_API_KEY;
    console.log("apikey is",apiKey);

    if (!vehicle_no || !userId) {
      return res.status(400).json({ error: 'All fields are  required like vehicle no and userId.' });
    }

    const apiUrl = `https://rappid.in/apis/rto/rc_vehicle_details.php?key=${apiKey}&vehicle_no=${vehicle_no}`;

    try {
      const response = await axios.get(apiUrl,{
        timeout:30000
      });
      if (response.status === 200) {
        
        if(response.data.rc_owner_name !==ownerName.toUpperCase()){
          return res.status(403).json("You are not authorized kindly check your owner name");
        }

        const {rc_regn_dt,
          rc_fit_upto,
          rc_status_as_on,
          rc_financer,
          rc_insurance_comp,
          rc_insurance_upto,
          rc_pucc_upto,
          rc_owner_name,
          rc_permanent_address,
          rc_status} = response.data;
          console.log(response.data)

       const newVehicle = await Vehicle.create({
        userId,
        vehicleData:{
          ownerName,
          registration:vehicle_no,
        },
        rtoUserVehicleData:{
          rc_regn_dt,
          rc_fit_upto,
          rc_status_as_on,
          rc_financer,
          rc_insurance_comp,
          rc_insurance_upto,
          rc_pucc_upto,
          rc_owner_name,
          rc_permanent_address,
          rc_status
        }
       })

        return res.status(200).json({
          message:"Vehicle create successfully",
          vehicle:newVehicle
        });

      } else {
        console.log("response from rto",response.data);
        res.status(404).json({ error: response.data.message || 'Vehicle not found in RTO records.' });
      }
    } catch (error) {
      console.error('Error fetching RTO data:', error.message);
      if (error.response) {
        res.status(error.response.status).json({
          error: error.response.data || 'Error from RTO API',
        });
      } else {
        res.status(500).json({ error: 'Internal server error while fetching RTO data.' });
      }
    }
  })
);

export default router;
