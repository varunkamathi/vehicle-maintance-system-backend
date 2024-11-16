// models/User.js
import mongoose from 'mongoose';
// For hashing passwords

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }]

}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id }; // Use the user's unique ID as the payload
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // Replace with your JWT secret
  return token;
};
// Pre-save middleware to hash the password before saving it
/*userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};*/

const User = mongoose.model('User', userSchema);

export default User;
