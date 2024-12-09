import { Apierrorr } from "../util/Apierrorr.js";
import { asyncHandler } from "../util/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../model/User.model.js";
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY= process.env.ACCESS_TOKEN_SECRET


export const verifyJWT = asyncHandler(async(req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  console.log("token is",token);
  console.log("access token is",SECRET_KEY);
 
  if (!token) {
      return res.status(401).json({ message: "No token provided" });
  }

  try {
    

    // Function to generate a JWT
    const generateToken = (userId) => {
      // Payload data (you can include additional fields if needed)
      const payload = {
        userId: userId,
      };
    
      // Options (e.g., expiration time)
      const options = {
        expiresIn: "1h", // Token valid for 1 hour
      };
    
      // Generate the token
      const token = jwt.sign(payload, SECRET_KEY, options);
      return token;
    };
    
    // Example usage
    const userId = "12345"; // Replace with your user ID or relevant data
    const token = generateToken(userId);
    
    console.log("Generated JWT:", token);
  } catch (err) {
    console.log("ERROR:IN VERIFYJWT HANDLER",err);
      return res.status(403).json({ message: "Invalid token" });
  }
    
})

