import Vehicle from '../model/vehicle.model.js';
import User from '../model/User.model.js';


export const addVehicle = async (req, res) => {
  try {
    const { vehicleData, serviceData } = req.body;

    // Validation
    if (!vehicleData || !serviceData) {
      return res.status(400).json({ error: 'Vehicle and Service data are required.' });
    }

    // Create a new vehicle
    const newVehicle = new Vehicle({
      vehicleData,
      serviceData,
      user: req.user._id, // Use the authenticated user's ID
    });

    await newVehicle.save();

    // Update user's vehicles array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { vehicles: newVehicle._id },
    });

    res.status(201).json(newVehicle);
  } catch (err) {
    console.error('Error adding vehicle:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

  

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user.id });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
};
