// api/controllers/authController.js
import User from '../model/User.model.js'
import bcrypt from 'bcrypt';// For hashing passwords
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
 // Replace with an actual secret or load from environment variables

// Registration controller
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new user
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  };

// Login controller
 export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

 export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude sensitive fields
    console.log(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


