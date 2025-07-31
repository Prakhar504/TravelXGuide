import adminModel from "../models/adminModel.js";
import GuideApplication from "../models/guideModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const admin = await adminModel.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get all guide applications
export const getAllGuideApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const applications = await GuideApplication.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password -verificationOtp -verificationOtpExpireAt");

    const total = await GuideApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        hasNext: skip + applications.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get single guide application
export const getGuideApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await GuideApplication.findById(id)
      .select("-password -verificationOtp -verificationOtpExpireAt");

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "Application not found" 
      });
    }

    res.status(200).json({
      success: true,
      application
    });

  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Approve guide application
export const approveGuideApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.admin.adminId;

    const application = await GuideApplication.findById(id);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "Application not found" 
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: "Application has already been processed" 
      });
    }

    application.status = "approved";
    application.adminNotes = adminNotes || "";
    application.approvedBy = adminId;
    application.approvedAt = new Date();
    await application.save();

    // Send approval email to guide
    await sendApprovalEmail(application);

    res.status(200).json({
      success: true,
      message: "Guide application approved successfully"
    });

  } catch (error) {
    console.error("Approve application error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Reject guide application
export const rejectGuideApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.admin.adminId;

    const application = await GuideApplication.findById(id);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "Application not found" 
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: "Application has already been processed" 
      });
    }

    application.status = "rejected";
    application.adminNotes = adminNotes || "";
    application.approvedBy = adminId;
    application.approvedAt = new Date();
    await application.save();

    // Send rejection email to guide
    await sendRejectionEmail(application);

    res.status(200).json({
      success: true,
      message: "Guide application rejected"
    });

  } catch (error) {
    console.error("Reject application error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Unlist or relist a guide
export const setGuideActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const guide = await GuideApplication.findById(id);
    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }
    guide.isActive = !!isActive;
    await guide.save();
    res.status(200).json({ success: true, message: `Guide has been ${isActive ? "listed" : "unlisted"}.` });
  } catch (error) {
    console.error("Set guide active status error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalApplications = await GuideApplication.countDocuments();
    const pendingApplications = await GuideApplication.countDocuments({ status: "pending" });
    const approvedApplications = await GuideApplication.countDocuments({ status: "approved" });
    const rejectedApplications = await GuideApplication.countDocuments({ status: "rejected" });

    // Recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentApplications = await GuideApplication.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
        recent: recentApplications
      }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Helper function to send approval email
const sendApprovalEmail = async (application) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: application.email,
      subject: "Congratulations! Your Guide Application Has Been Approved",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">🎉 Application Approved!</h2>
          <p>Dear ${application.name},</p>
          <p>We are pleased to inform you that your guide application has been approved!</p>
          <p>You can now log in to your guide dashboard and start offering your services to travelers.</p>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Upload your profile picture</li>
            <li>Set your availability</li>
            <li>Start receiving booking requests</li>
          </ul>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>TravelXGuide Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Approval email sent to guide!");
  } catch (error) {
    console.error("❌ Failed to send approval email:", error);
  }
};

// Helper function to send rejection email
const sendRejectionEmail = async (application) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: application.email,
      subject: "Update on Your Guide Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Application Status Update</h2>
          <p>Dear ${application.name},</p>
          <p>Thank you for your interest in becoming a guide with TravelXGuide.</p>
          <p>After careful review, we regret to inform you that your application has not been approved at this time.</p>
          ${application.adminNotes ? `<p><strong>Feedback:</strong> ${application.adminNotes}</p>` : ''}
          <p>You are welcome to reapply in the future with updated information.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>TravelXGuide Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Rejection email sent to guide!");
  } catch (error) {
    console.error("❌ Failed to send rejection email:", error);
  }
}; 