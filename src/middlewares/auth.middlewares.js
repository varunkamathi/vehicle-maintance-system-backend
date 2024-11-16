// api/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../model/User.model.js'; // Import the User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user details to the request object
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
