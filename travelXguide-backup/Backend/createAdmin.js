import bcrypt from "bcrypt";
import adminModel from "./models/adminModel.js";
import connectDB from "./config/mongodb.js";
import "dotenv/config";

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: "admin@travelxguide.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create admin user
    const admin = new adminModel({
      name: "Admin",
      email: "admin@travelxguide.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: ["manage_guides", "view_applications", "approve_reject"]
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@travelxguide.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login!");
    
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    process.exit(0);
  }
};

createAdmin(); 