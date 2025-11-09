import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { socket } from "../socket/socket"; 


export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.timeout = 10000; // 10 second timeout
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  console.log("AppContext initialized, backend URL:", backendUrl);

  // Add axios interceptors for better error handling
  axios.interceptors.request.use(
    (config) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      
      // Add Authorization header if token exists and is valid
      const token = localStorage.getItem("token");
      if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Adding Authorization header with token");
      } else if (token === "undefined" || token === "null") {
        console.log("🔑 Invalid token found, clearing it");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      
      return config;
    },
    (error) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error("❌ Response Error:", error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else if (error.response?.status === 0) {
        toast.error("Network error. Please check your connection.");
      } else if (error.response?.status === 401) {
        console.log("401 Unauthorized error, clearing auth data");
        // Clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Don't redirect automatically to prevent loops
        // window.location.href = "/signup";
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please check your permissions.");
      } else if (error.response?.status === 404) {
        toast.error("Resource not found.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.message === "Not allowed by CORS") {
        toast.error("CORS error. Please check your configuration.");
      } else {
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      }
      
      return Promise.reject(error);
    }
  );

  // ✅ Load auth state safely from localStorage
  const [isLoggedin, setIsLoggedin] = useState(() => {
    const token = localStorage.getItem("token");
    return !!(token && token !== "undefined" && token !== "null");
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [authChecked, setAuthChecked] = useState(false); // Prevent multiple auth checks


  const [userData, setUserData] = useState(() => {
  try {
    const storedUser = localStorage.getItem("user");
    console.log("Retrieved user from localStorage:", storedUser); // ✅ Debug log

    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);
    
    if (!parsedUser.id && parsedUser._id) {
      parsedUser.id = parsedUser._id; // ✅ Ensure `id` is present
    }

    console.log("Parsed user data:", parsedUser); // ✅ Debug log
    return parsedUser;
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
});



  // ✅ Establish Socket Connection when user logs in
  useEffect(() => {
    if (userData && !socket.connected) {
      socket.connect();
      console.log("Socket connected");
  
      console.log("Emitting joinGroup event:", userData);
      socket.emit("joinGroup", { userId: userData?.name, groupId: "travel-group" });
  
      // Fetch old messages when joining
      axios.get(`${backendUrl}/api/chat/messages/travel-group`)
        .then(({ data }) => {
          if (data.success) {
            setChatMessages(data.messages); // ✅ Store chat history in state
          }
        })
        .catch((err) => console.error("Error fetching messages:", err));
  
      socket.on("receiveMessage", (newMessage) => {
        setChatMessages((prev) => [...prev, newMessage]); // ✅ Append new messages
      });
  
      return () => {
        socket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [userData]);
  
  

  // ✅ Validate and clean up invalid tokens
  const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      console.log("Invalid token found, clearing authentication data");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedin(false);
      setUserData(null);
      return false;
    }
    return true;
  };

  // ✅ Fetch User Data (Only if missing)
  const getUserData = async () => {
    console.log("getUserData called, userData:", userData);
    if (userData) {
      console.log("User data already exists, skipping fetch");
      return;
    }

    console.log("Fetching user data...");
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token ? "EXISTS" : "MISSING");
      
      if (!validateToken()) {
        console.log("No valid token found, skipping user data fetch");
        return;
      }
      
      console.log("Valid token found, fetching user data with token:", token);
      
      const { data } = await axios.get(`${backendUrl}/api/auth/profile`);
      console.log("Profile API response:", data);

      if (data.success) {
        setUserData(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User data fetched and stored successfully:", data.user);
      } else {
        console.error("Failed to fetch user data:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // If we get a 401 error, clear the invalid token
      if (error.response?.status === 401) {
        console.log("Unauthorized error, clearing invalid token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedin(false);
        setUserData(null);
      }
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  // ✅ Check Authentication on Mount (Once)
  useEffect(() => {
    if (authChecked) return; // Prevent multiple checks
    
    const checkAuth = async () => {
      try {
        setAuthChecked(true); // Mark as checked
        
        // Check if we have a token in localStorage first
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
          console.log("No valid token found, skipping auth check");
          setIsLoggedin(false);
          setUserData(null);
          return;
        }

        console.log("Checking authentication with existing token...");
        const { data } = await axios.get(`${backendUrl}/api/auth/profile`);
        
        if (data.success) {
          setIsLoggedin(true);
          setUserData(data.user);
          console.log("Authentication check successful");
        } else {
          console.log("Authentication check failed, clearing data");
          setIsLoggedin(false);
          setUserData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.log("Authentication check error:", error.message);
        setIsLoggedin(false);
        setUserData(null);
        // Clear invalid tokens
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };
  
    checkAuth();
  }, [authChecked]);
  
  

  // ✅ Signup Function
  const signup = async (name, email, password, navigate) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });

      if (data.success && data.user && data.token) {
        console.log("Signup successful, storing token:", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoggedin(true);
        setUserData(data.user);
        toast.success("Signup successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // ✅ Login Function
  const login = async (email, password, navigate) => {
    console.log("Login function called!");

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
  
      console.log("Login response:", data); // Debug log
  
      if (data.success && data.user && data.token) {
        console.log("Token received:", data.token); // Debug log
        
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        console.log("Token stored in localStorage:", localStorage.getItem("token")); // Debug log
        
        // Store user data
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User stored in localStorage:", localStorage.getItem("user")); // Debug log
        
        // Update state
        setIsLoggedin(true);
        setUserData(data.user);
        
        // Verify token was stored correctly
        const storedToken = localStorage.getItem("token");
        if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
          console.log("✅ Token successfully stored and validated");
        } else {
          console.error("❌ Token storage failed or token is invalid");
        }
        
        toast.success("Login successful!");
        navigate("/");
      } else {
        console.error("Login failed - missing data:", data); // Debug log
        toast.error(data.message || "Login failed - invalid response");
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  
  

  // ✅ Logout Function (Clear State First)
  const logout = async () => {
    try {
        await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true }); // ✅ Ensure cookies are included

        // ✅ Clear stored authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        console.log("Token:", localStorage.getItem("token"));
console.log("User:", localStorage.getItem("user"));
console.log("Session Token:", sessionStorage.getItem("token"));
console.log("Session User:", sessionStorage.getItem("user"));


        // ✅ Reset authentication state
        setIsLoggedin(false);
        setUserData(null);

        toast.success("Logged out successfully!");
        // Don't reload the page, let React handle the state update
        // window.location.reload(); // ✅ Ensure UI updates
    } catch (error) {
        console.error("Logout Error:", error);
        toast.error(error.response?.data?.message || "Logout failed");
    }
};

  

  // Debug function to check token status
  const debugTokenStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    console.log("🔍 Token Debug Info:");
    console.log("Token exists:", !!token);
    console.log("Token value:", token);
    console.log("Token is undefined:", token === "undefined");
    console.log("Token is null:", token === "null");
    console.log("User exists:", !!user);
    console.log("User value:", user);
    console.log("isLoggedin state:", isLoggedin);
    console.log("userData state:", userData);
    
    return {
      tokenExists: !!token,
      tokenValue: token,
      tokenIsUndefined: token === "undefined",
      tokenIsNull: token === "null",
      userExists: !!user,
      userValue: user,
      isLoggedin,
      userData
    };
  };

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        signup,
        login,
        logout,
        validateToken,
        debugTokenStatus,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
