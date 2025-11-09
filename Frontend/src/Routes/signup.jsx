import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Google OAuth configuration - using Vite's import.meta.env
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id-here";

  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, message: "Email is required" };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
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

    return { isValid: true, message: "" };
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail) {
      const validation = validateEmail(newEmail);
      setEmailError(validation.message);
    } else {
      setEmailError("");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Initialize Google OAuth
      if (window.google) {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile',
          callback: async (response) => {
            try {
              // Get user info from Google
              const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              }).then(res => res.json());

              // Send to backend
              const authResponse = await axios.post(`${backendUrl}/api/auth/oauth-login`, {
                provider: 'google',
                oauthId: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                profilePicture: userInfo.picture
              });

              if (authResponse.data.success) {
                console.log("OAuth login successful, response:", authResponse.data);
                console.log("Token received:", authResponse.data.token);
                console.log("User received:", authResponse.data.user);
                
                localStorage.setItem("token", authResponse.data.token);
                localStorage.setItem("user", JSON.stringify(authResponse.data.user));
                
                console.log("Token stored:", localStorage.getItem("token"));
                console.log("User stored:", localStorage.getItem("user"));
                
                setIsLoggedin(true);
                getUserData();
                toast.success("Google login successful!");
                navigate("/");
              } else {
                console.error("OAuth login failed:", authResponse.data);
                toast.error(authResponse.data.message || "Google login failed");
              }
            } catch (error) {
              toast.error("Google login failed");
            } finally {
              setIsLoading(false);
            }
          }
        });
        client.requestAccessToken();
      }
    } catch (error) {
      toast.error("Google login failed");
      setIsLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate name for signup
    if (state === "Sign Up" && (!name || name.trim().length < 2)) {
      toast.error("Please enter a valid name (at least 2 characters)");
      setIsLoading(false);
      return;
    }
    
    // Validate email before submission
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message);
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Submitting form...");
      console.log("State:", state);
      console.log("Email:", email);
      console.log("Password:", password);
  
      axios.defaults.withCredentials = true;
  
      let response;
      if (state === "Sign Up") {
        console.log("Sending sign-up request...");
        response = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
  
        const { data } = response;
        console.log("Response received:", data);
  
        if (data.success) {
          console.log("Token received on signup:", data.token);
          localStorage.setItem("token", data.token);
          console.log("Stored token:", localStorage.getItem("token"));

          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Stored user:", localStorage.getItem("user"));

          setIsLoggedin(true);
          getUserData();
          toast.success("Registration successful! You can now use all features.");
          navigate("/");
          return;
        } else {
          toast.error(data.message || "Registration failed");
        }
      } else {
        console.log("Sending login request...");
        response = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
  
        const { data } = response;
        console.log("Response received:", data);
  
        if (data.success && data.user && data.token) {
          console.log("Token received on login:", data.token);
          localStorage.setItem("token", data.token);
          console.log("Stored token:", localStorage.getItem("token"));

          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Stored user:", localStorage.getItem("user"));

          setIsLoggedin(true);
          getUserData();
          toast.success("Login successful!");
          navigate("/");
          return;
        } else {
          console.error("Login failed - missing data:", data);
          toast.error(data.message || "Login failed - invalid response");
        }
      }
    } catch (error) {
      console.error("Error in authentication:", error);
      
      // Handle specific error cases
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        toast.error("Server not found. Please check your connection.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="w-full max-w-xs sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-xl">
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-center">
          <h1 className="text-2xl font-bold text-white">
            {state === "Sign Up" ? "Welcome Aboard" : "Welcome Back"}
          </h1>
          <p className="text-indigo-100 mt-1 text-sm">
            {state === "Sign Up" ? "Create your account in seconds" : "Login to access your dashboard"}
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {state === "Sign Up" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}



            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                onChange={handleEmailChange}
                value={email}
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:border-indigo-500 ${
                  emailError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
                type="email"
                placeholder="Email address"
                required
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            {state === "Login" && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (emailError && state === "Sign Up")}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {state === "Sign Up" ? "Creating Account..." : "Signing In..."}
                </div>
              ) : state === "Sign Up" ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {state === "Sign Up" ? "Sign in instead" : "Create new account"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;