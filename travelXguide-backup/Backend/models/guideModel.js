import mongoose from "mongoose";

const guideApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    experience: { type: String, required: true },
    languages: [{ type: String, required: true }],
    destinations: [{ type: String, required: true }],
    bio: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    profileImage: { type: String, default: "" },
    documents: [{ type: String }], // Array of document URLs
    status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
    adminNotes: { type: String, default: "" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    approvedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    toursCompleted: { type: Number, default: 0 },
    verificationOtp: { type: String, default: "" },
    verificationOtpExpireAt: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for better query performance
guideApplicationSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("GuideApplication", guideApplicationSchema);
