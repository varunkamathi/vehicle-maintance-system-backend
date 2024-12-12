import { Vehicle } from '../model/vehicle.model.js';
import { User } from '../model/User.model.js';
import  {Apierrorr} from '../util/Apierrorr.js'
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

export const addVehicle = asyncHandler(async (req, res) => {
  const { vehicleData, serviceData, userId } = req.body;
  console.log("user id from front end is",userId);
  // Validate input
  if (!vehicleData) {
    throw new Apierrorr(400, "Vehicle data are required.");
  }

  // Create a new vehicle associated with the user
  const newVehicle = new Vehicle({
    vehicleData,
    serviceData,
    userId: userId, // Attach the authenticated user's ID
  });

  await newVehicle.save();

  // Update user's vehicles array
  // await User.findByIdAndUpdate(
  //   req.user._id,
  //   { $push: { vehicles: newVehicle._id } },
  //   { new: true }
  // );

  res.status(201).json(new ApiResponse(newVehicle, "Vehicle added successfully."));
});

export const getVehicles = asyncHandler(async (req, res) => {
  // Fetch all vehicles associated with the authenticated user
  const {userId}=req.params;
  console.log("user id from params",userId);
  const vehicle = await Vehicle.find({_id});
  console.log("vehicleId : ", _id);

  const vehicles = await Vehicle.find({ userId:userId });

  if (!vehicles || vehicles.length === 0) {
    throw new Apierrorr(404, "No vehicles found for this user.");
  }
  console.log(vehicles);
  res.status(200).json({
    vehicles
  });
});
