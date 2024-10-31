import mongoose from 'mongoose';



const connectDB = async () => {
    try {
         await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('MongoDB connection error:', error)
    }
}

export default connectDB