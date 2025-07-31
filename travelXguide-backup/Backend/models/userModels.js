import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  
  // Role-based access control
  role: { 
    type: String, 
    enum: ['traveler', 'guide', 'admin'], 
    default: 'traveler' 
  },
  
  // OAuth integration
  oauthProvider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  oauthId: { type: String, default: null },
  profilePicture: { type: String, default: null },
  
  // Email verification
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date, default: null },
  
  // Password reset
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  
  // Account status
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  lastLoginAt: { type: Date, default: null },
  
  // Additional user info
  phone: { type: String, default: null },
  dateOfBirth: { type: Date, default: null },
  location: { type: String, default: null },
  bio: { type: String, default: null },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ oauthProvider: 1, oauthId: 1 });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;