import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
    vehicleData: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        registration: { type: String, required: true },
        vin: { type: String, required: true },
      },
      serviceData: {
        lastServiceDate: { type: Date },
        nextServiceDate: { type: Date  },
        serviceType: { type: String },
        serviceCenter: { type: String },
        cost: { type: Number },
      },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }, { timestamps: true });
    // Link vehicle to a user


const Vehicle = mongoose.model('Vehicle', VehicleSchema);

export default Vehicle;
