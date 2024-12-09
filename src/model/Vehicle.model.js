import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const VehicleSchema = new mongoose.Schema({
    userId: {  
      type: Schema.Types.ObjectId,
      ref: "User" 
    }
    ,
    vehicleData: {
        ownerName: { type: String,},
        registration: { type: String },
        vin: { type: String },
        
      },
    rtoUserVehicleData:{
      rc_regn_dt:{
        type:String
      },
      rc_fit_upto:{
        type:String
      },
      rc_status_as_on:{
        type:String
      },
      rc_financer:{
        type:String
      },
      rc_insurance_comp:{
        type:String
      },
      rc_insurance_upto:{
        type:String
      },
      rc_pucc_upto:{
        type:String
      },
      rc_owner_name:{
        type:String
      },
      rc_permanent_address:{
        type:String
      },
      rc_status:{
        type:String
      }

    }
    
      // serviceData: {
      //   lastServiceDate: { type: Date },
      //   nextServiceDate: { type: Date  },
      //   serviceType: { type: String },
      //   serviceCenter: { type: String },
      //   cost: { type: Number },
      // },
      
    }, { timestamps: true });
    // Link vehicle to a user


export const Vehicle = mongoose.model('Vehicle', VehicleSchema);


