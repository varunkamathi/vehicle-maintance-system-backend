import { Router } from 'express';
import { addVehicle, getVehicles } from '../controllers/vehicle.controller.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import axios from 'axios';
import dotenv from 'dotenv';
import multer from 'multer'
import { asyncHandler } from '../util/asyncHandler.js';
import {Vehicle} from '../model/vehicle.model.js';
import {Echallan} from '../model/vehicle.model.js';  // Import the Vehicle model
import vehicleData from '../data.json' assert { type: 'json' };
import eChallanData from '../challan.json' assert { type: 'json' };
import { Document } from '../model/vehicle.model.js';

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

router.get(
  '/get/challan/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
      const challans = await Echallan.find({ userId });
      // const vehicles = await Vehicle.find({ userId }).sort({ createdAt: 1 });
      if (!challans || challans.length === 0) {
        return res.status(404).json({ error: 'No vehicles found for this user.' });
      }
      res.status(200).json(challans);
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
router.delete("/delete/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log("user : ",_id);

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(_id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully", vehicle: deletedVehicle });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle", error });
  }
});

/**
 * Route to fetch vehicle details from the RTO API
 * Endpoint: GET /api/vehicles/rto/lookup/:vehicle_no
 */

// add vehical
// Sample JSON data


// Route to fetch vehicle details by registration number

router.get(
  '/vehicle/lookup',
  asyncHandler(async (req, res) => {
    try {
      // Destructure the input from the query
      const { vehicle_no, ownerName, userId } = req.query;

      if (!vehicle_no || !ownerName || !userId) {
        return res.status(400).json({ error: 'Missing required parameters: vehicle_no, ownerName, or userId' });
      }

      const rc_regn_no = vehicle_no; // Use the vehicle_no directly
      const vehicle = vehicleData[rc_regn_no]; // Access the vehicle from your data

      // Check if the vehicle exists
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      // Extract owner name from the vehicle data
      const rcOwnerName = vehicle['rc_owner_name'];

      // Check if the provided owner name matches the vehicle owner
      if (rcOwnerName.toUpperCase() !== ownerName.toUpperCase()) {
        return res.status(403).json("You are not authorized kindly check your owner name");
      }

      // Destructure required details from the vehicle data
      const {
        rc_regn_dt,
        rc_fit_upto,
        rc_status_as_on,
        rc_financer,
        rc_insurance_comp,
        rc_insurance_upto,
        rc_pucc_upto,
        rc_owner_name,
        rc_permanent_address,
        rc_status,
      } = vehicle;

      // Save the vehicle data to the database
      const newVehicle = await Vehicle.create({
        userId,
        vehicleData: {
          ownerName,
          registration: vehicle_no,
        },
        rtoUserVehicleData: {
          rc_regn_dt,
          rc_fit_upto,
          rc_status_as_on,
          rc_financer,
          rc_insurance_comp,
          rc_insurance_upto,
          rc_pucc_upto,
          rc_owner_name,
          rc_permanent_address,
          rc_status,
        }
      })

       return res.status(200).json({
         message:"Vehicle create successfully",
         vehicle:newVehicle
       });
    } catch (error) {
      console.error('Error in /vehicle/lookup:', error.message);

      if (error.response) {
        // Handle specific error from external APIs if applicable
        res.status(error.response.status).json({
          error: error.response.data || 'Error from external service.',
        });
      } else {
        res.status(500).json({ error: 'Internal server error while processing the request.' });
      }
    }
  })
);
// Mock data for e-challan
/*const eChallanData = {
  MH20HC7323: [
    {
      challanNo: 'CHL001234',
      date: '2024-12-20',
      amount: 500,
      status: 'Pending',
      violation: 'Speeding',
      location: 'Chhatrapati Sambhajinagar',
    },
    {
      challanNo: 'CHL001235',
      date: '2024-10-15',
      amount: 300,
      status: 'Paid',
      violation: 'Parking Violation',
      location: 'Chhatrapati Sambhajinagar',
    },
  ],
  MH24AN2786: [
    {
      challanNo: 'CHL002345',
      date: '2024-11-10',
      amount: 1000,
      status: 'Pending',
      violation: 'Signal Jumping',
      location: 'Latur',
    },
  ],
};*/

router.get(
  '/vehicle/e-challan:',
  asyncHandler(async (req, res) => {
    try {
      const { vehicle_no, userId } = req.query;

      // Validate input
      if (!vehicle_no) {
        return res.status(400).json({ error: 'Vehicle number is required.' });
      }

      // Fetch e-challan data
      const challan = eChallanData[vehicle_no];
      console.log("data", challan);

      const {
        challanNo,
            date,
            amount,
            status,
            violation,
            location,
      } = challan;

       // Save the vehicle data to the database
       const newChallan = await Echallan.create({
        userId,
        vehicle_no,
        challans: 
                 {
                  challanNo,
                  date,
                  amount,
                  status,
                  violation,
                  location,
                 },
                
      })

      if (!challan || challan.length === 0) {
        return res.status(404).json({ error: 'No e-challan records found for this vehicle.' });
      }

      // Return response
     /* res.status(200).json({
        message: 'E-challan records fetched successfully.',
        vehicle_no,
        challans,
      });*/
      
      return res.status(200).json({
        message:"Vehicle create successfully",
        challan:newChallan
      });
    } catch (error) {
      console.error('Error fetching e-challan data:', error.message);
      res.status(500).json({ error: 'Internal server error while fetching e-challan data.' });
    }
  })
);





/*router.get(
  '/rto/:rc_regn_no',
  asyncHandler(async (req, res) => {
    //const { vehicle_no ,ownerName,userId} = req.query;
    const rcRegnNo = req.params.rc_regn_no;

    console.log("vehicle number is",rcRegnNo);
    
   // const apiKey = process.env.RTO_API_KEY;
    //console.log("apikey is",apiKey);

    if (!vehicle_no || !userId) {
      return res.status(400).json({ error: 'All fields are  required like vehicle no and userId.' });
    }
   // const apiUrl = `https://rappid.in/apis/rto/rc_vehicle_details.php?key=${apiKey}&vehicle_no=${vehicle_no}`;
   const jsonUrl = "https://varunkamathi.github.io/RTO_data/flutter.json";


   try {
     // Fetch JSON data from the GitHub URL
     const response = await fetch(jsonUrl);

     if (!response.ok) {
       // Handle HTTP errors
       throw new Error(`Failed to fetch JSON data: ${response.statusText}`);
     }

     const data = await response.json(); // Parse the JSON response

     // Find the vehicle matching the provided registration number
     const specificVehicle = data.find(vehicle => vehicle.rc_regn_no === rcRegnNo);

     if (!specificVehicle) {
       // If the vehicle is not found
       return res.status(404).json({ error: "Vehicle not found in the data." });
     }

     // Respond with the specific vehicle data
     res.status(200).json(specificVehicle);
   } catch (error) {
     console.error("Error fetching JSON data:", error.message);
     res.status(500).json({ error: "Internal server error while fetching vehicle data." });
   }

    /*try {
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
}));*/

// Set up multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload a PDF
router.post(
  '/upload',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const { userId } = req.query;

    const newDocument = new Document({
      userId,
      fileName: req.file.originalname,
      fileData: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await newDocument.save();
    res.status(201).json({ message: 'File uploaded successfully', document: newDocument });
  })
);

// Route to fetch all uploaded PDFs
router.get(
  '/documents',
  asyncHandler(async (req, res) => {
    const { userId } = req.query;

    const documents = await Document.find({userId});
    res.status(200).json(documents);
  })
);


export default router;
