import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("✅ Database connected"));
    mongoose.connection.on('error', (err) => console.error("❌ Database error:", err));
    mongoose.connection.on('disconnected', () => console.log("⚠️ Database disconnected"));

    // ⚡ PERFORMANCE: Optimize MongoDB connection settings
    const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(`${process.env.MONGODB_URI}/travel-auth`, options);
    
    // ⚡ PERFORMANCE: Enable query result caching
    mongoose.set('strictQuery', true);
};

export default connectDB;