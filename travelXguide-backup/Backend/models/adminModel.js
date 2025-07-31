import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin", enum: ["admin", "super_admin"] },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  permissions: [{ type: String }], // Array of permission strings
}, { timestamps: true });

// Index for better query performance
adminSchema.index({ email: 1 }, { unique: true });

const adminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default adminModel; 