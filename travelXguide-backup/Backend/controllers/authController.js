import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

// Helper function to generate JWT token
const generateToken = (userId) => {
  console.log("🔑 Generating token for userId:", userId);
  console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
  console.log("🔑 JWT_SECRET value:", process.env.JWT_SECRET ? "***SECRET***" : "UNDEFINED");
  
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined in environment variables!");
    throw new Error("JWT_SECRET not configured");
  }
  
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  
  console.log("🔑 Token generated successfully:", token ? "TOKEN_GENERATED" : "FAILED");
  return token;
};

// Helper function to set authentication cookie
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Email validation function
const isValidEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  // Check for common disposable email domains
  const disposableDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'temp-mail.org', 'sharklasers.com', 'getairmail.com',
    'mailnesia.com', 'maildrop.cc', 'mailcatch.com', 'tempmailaddress.com',
    'fakeinbox.com', 'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com',
    'mailmetrash.com', 'mailnull.com', 'spamspot.com', 'spam.la', 'trashmail.net'
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return { isValid: false, message: "Disposable email addresses are not allowed" };
  }

  // Check email length
  if (email.length > 254) {
    return { isValid: false, message: "Email address is too long" };
  }

  // Check for valid characters
  const validCharsRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!validCharsRegex.test(email)) {
    return { isValid: false, message: "Email contains invalid characters" };
  }

  return { isValid: true, message: "Email is valid" };
};

export const register = async (req, res) => {
  const { name, email, password, role = 'traveler' } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  // Validate email
  const emailValidation = isValidEmail(email);
  if (!emailValidation.isValid) {
    return res.json({ success: false, message: emailValidation.message });
  }

  // Validate role
  if (!['traveler', 'guide', 'admin'].includes(role)) {
    return res.json({ success: false, message: "Invalid role" });
  }

  // Validate password strength
  if (password.length < 8) {
    return res.json({ success: false, message: "Password must be at least 8 characters long" });
  }

  try {
    console.log("🔹 Received Registration Request:", req.body);

    const existingUser = await userModel.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.log("⚠️ User already exists in DB:", existingUser);
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword,
      role,
      oauthProvider: 'local',
      isAccountVerified: true, // Direct registration - no email verification needed
      emailVerifiedAt: new Date() // Mark as verified immediately
    });

    await user.save();
    console.log("✅ User registered and verified successfully:", { name, email, role });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({ 
      success: true, 
      message: "Registration successful! You can now use all features.", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified
      }, 
      token 
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    if (error.name === 'ValidationError') {
      console.error("Validation error:", error.message);
      res.json({ 
        success: false, 
        message: "Invalid data provided. Please check your information." 
      });
    } else if (error.code === 11000) {
      console.error("Duplicate key error:", error.message);
      res.json({ 
        success: false, 
        message: "User already exists with this email." 
      });
    } else {
      console.error("Unknown registration error:", error.message);
      res.json({ 
        success: false, 
        message: `Registration failed: ${error.message}` 
      });
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login request received:", req.body);

  if (!email || !password) {
    console.log("Missing email or password");
    return res.json({
      success: false,
      message: "Email and Password are required",
    });
  }

  // Validate email format
  const emailValidation = isValidEmail(email);
  if (!emailValidation.isValid) {
    return res.json({ success: false, message: emailValidation.message });
  }

  try {
    console.log(`Checking user with email: ${email}`);
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found in database");
      return res.json({ success: false, message: "Invalid Email" });
    }

    // Check if account is blocked
    if (user.isBlocked) {
      return res.json({ success: false, message: "Account is blocked. Please contact support." });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.json({ success: false, message: "Account is deactivated. Please contact support." });
    }

    console.log("User found. Verifying password...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Invalid password provided");
      return res.json({ success: false, message: "Invalid Password" });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    console.log("Password verified. Generating JWT token...");
    const token = generateToken(user._id);
    console.log("🔑 Token received from generateToken:", token ? "TOKEN_EXISTS" : "TOKEN_UNDEFINED");
    
    setAuthCookie(res, token);

    console.log("Login successful!");
    console.log("🔑 Sending response with token:", token ? "TOKEN_INCLUDED" : "NO_TOKEN");
    
    return res.json({ 
      success: true, 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// OAuth Login (Google)
export const oauthLogin = async (req, res) => {
  const { provider, oauthId, name, email, profilePicture } = req.body;

  if (!provider || !oauthId || !name || !email) {
    return res.json({ success: false, message: "Missing OAuth details" });
  }

  // Validate email from OAuth
  const emailValidation = isValidEmail(email);
  if (!emailValidation.isValid) {
    return res.json({ success: false, message: emailValidation.message });
  }

  // Only allow Google OAuth
  if (provider !== 'google') {
    return res.json({ success: false, message: "Unsupported OAuth provider" });
  }

  // Note: Google Client ID should be configured in .env as GOOGLE_CLIENT_ID
  // Google Client Secret should be configured in .env as GOOGLE_CLIENT_SECRET

  try {
    // Check if user exists with this OAuth provider
    let user = await userModel.findOne({ 
      oauthProvider: provider, 
      oauthId: oauthId 
    });

    if (!user) {
      // Check if user exists with this email
      user = await userModel.findOne({ email: email.toLowerCase() });
      
      if (user) {
        // Link existing account with OAuth
        user.oauthProvider = provider;
        user.oauthId = oauthId;
        user.profilePicture = profilePicture;
        user.isAccountVerified = true; // OAuth accounts are pre-verified
        user.emailVerifiedAt = new Date();
      } else {
        // Create new user with OAuth
        user = new userModel({
          name,
          email: email.toLowerCase(),
          password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for OAuth users
          oauthProvider: provider,
          oauthId: oauthId,
          profilePicture,
          isAccountVerified: true,
          emailVerifiedAt: new Date(),
          role: 'traveler'
        });
      }
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: `${provider} login successful`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("OAuth login error:", error);
    return res.json({ success: false, message: "OAuth login failed" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    // ✅ Ensure token expires
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire instantly
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification OTP sent to your email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify the Email using the OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "Missing details",
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.emailVerifiedAt = new Date();
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password -verifyOtp -resetOtp');
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { name, phone, location, bio, dateOfBirth } = req.body;

  try {
    const user = await userModel.findById(req.user.id);
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);

    await user.save();

    return res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  // Validate email format
  const emailValidation = isValidEmail(email);
  if (!emailValidation.isValid) {
    return res.json({ success: false, message: emailValidation.message });
  }

  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset User Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and New Password are required",
    });
  }

  // Validate email format
  const emailValidation = isValidEmail(email);
  if (!emailValidation.isValid) {
    return res.json({ success: false, message: emailValidation.message });
  }

  // Validate password strength
  if (newPassword.length < 8) {
    return res.json({ success: false, message: "Password must be at least 8 characters long" });
  }

  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Change password (for authenticated users)
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  // Validate password strength
  if (newPassword.length < 8) {
    return res.json({ success: false, message: "Password must be at least 8 characters long" });
  }

  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};