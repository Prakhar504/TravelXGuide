import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [step, setStep] = useState("email"); // email, otp, newPassword
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email: email.toLowerCase(),
      });

      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setStep("otp");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email: email.toLowerCase(),
        otp,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password reset successfully!");
        navigate("/signup");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email: email.toLowerCase(),
      });

      if (response.data.success) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: password.length < minLength,
        uppercase: !hasUpperCase,
        lowercase: !hasLowerCase,
        numbers: !hasNumbers,
        special: !hasSpecialChar,
      }
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 mt-6 sm:mt-10">
      <div className="w-full max-w-xs sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            {step === "email" && "Reset Password"}
            {step === "otp" && "Verify OTP"}
            {step === "newPassword" && "Set New Password"}
          </h1>
          <p className="text-red-100 mt-2">
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "otp" && "Enter the 6-digit code sent to your email"}
            {step === "newPassword" && "Create a strong new password"}
          </p>
        </div>

        <div className="p-8">
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Send Reset Code
                  </>
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg tracking-widest"
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  type="password"
                  placeholder="New password"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  type="password"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Password strength:</div>
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordValidation.errors.length ? 'text-red-500' : 'text-green-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.errors.length ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordValidation.errors.uppercase ? 'text-red-500' : 'text-green-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.errors.uppercase ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      One uppercase letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordValidation.errors.lowercase ? 'text-red-500' : 'text-green-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.errors.lowercase ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      One lowercase letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordValidation.errors.numbers ? 'text-red-500' : 'text-green-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.errors.numbers ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      One number
                    </div>
                    <div className={`flex items-center text-xs ${passwordValidation.errors.special ? 'text-red-500' : 'text-green-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.errors.special ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      One special character
                    </div>
                  </div>
                  {confirmPassword && (
                    <div className={`flex items-center text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      Passwords match
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Action buttons */}
          <div className="mt-6 space-y-3">
            {step === "otp" && (
              <button
                onClick={resendOtp}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}

            <button
              onClick={() => {
                if (step === "otp") {
                  setStep("email");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                } else {
                  navigate("/signup");
                }
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              {step === "otp" ? "Back to Email" : "Back to Login"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl text-center">
          <p className="text-xs text-gray-500">
            Having trouble? <a href="#" className="text-red-600 hover:text-red-500">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 