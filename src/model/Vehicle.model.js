import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const VehicleSchema = new mongoose.Schema({
    userId: {  
      type: Schema.Types.ObjectId,
      ref: "User" 
    }
    ,
    vehicleData: {
        make: { type: String,},
        model: { type: String },
        registration: { type: String },
        vin: { type: String },
      },
      serviceData: {
        lastServiceDate: { type: Date },
        nextServiceDate: { type: Date  },
        serviceType: { type: String },
        serviceCenter: { type: String },
        cost: { type: Number },
      },
      
    }, { timestamps: true });
    // Link vehicle to a user


export const Vehicle = mongoose.model('Vehicle', VehicleSchema);


