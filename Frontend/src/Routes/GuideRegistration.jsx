import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Languages, 
  IndianRupee, 
  FileText,
  Eye,
  EyeOff,
  Search,
  X
} from "lucide-react";

function GuideRegistration() {
  // API Configuration for destination search
  const API_URL = "https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json";
  const API_KEY = "4690a014e7mshe970e24d2ef322fp1b5165jsn2f8db7cebf61";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    experience: "",
    languages: [],
    destinations: [],
    bio: "",
    hourlyRate: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Destination search state
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // Predefined options
  const languageOptions = [
    "English", "Hindi", "Tamil", "Bengali", "Marathi", "Gujarati", 
    "Punjabi", "Telugu", "Kannada", "Malayalam", "Odia", "Assamese",
    "French", "German", "Spanish", "Chinese", "Japanese", "Korean"
  ];

  const destinationOptions = [
    "Agra", "Jaipur", "Goa", "Leh", "Kolkata", "Mumbai", "Delhi", 
    "Varanasi", "Mysore", "Udaipur", "Chennai", "Hyderabad", 
    "Kochi", "Shimla", "Darjeeling", "Rishikesh", "Varanasi", 
    "Amritsar", "Jodhpur", "Jaisalmer", "Pushkar", "Khajuraho",
    "Hampi", "Mahabalipuram", "Konark", "Sanchi", "Ellora", "Ajanta"
  ];

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Password strength validation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };

  const handleDestinationChange = (destination) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter(dest => dest !== destination)
        : [...prev.destinations, destination]
    }));
  };

  // Destination search function
  const fetchDestinationSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setDestinationSuggestions([]);
      setShowDestinationDropdown(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}?input=${encodeURIComponent(input)}&types=geocode&language=en`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "google-map-places.p.rapidapi.com"
        }
      });
      const data = await res.json();
      setDestinationSuggestions(data?.predictions || []);
      setShowDestinationDropdown(true);
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
      setDestinationSuggestions([]);
    }
  };

  const handleDestinationSearch = (value) => {
    setDestinationSearch(value);
    fetchDestinationSuggestions(value);
  };

  const selectDestination = (destination) => {
    if (!formData.destinations.includes(destination)) {
      setFormData(prev => ({
        ...prev,
        destinations: [...prev.destinations, destination]
      }));
    }
    setDestinationSearch("");
    setDestinationSuggestions([]);
    setShowDestinationDropdown(false);
  };

  const removeDestination = (destination) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter(dest => dest !== destination)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImagePreview(null);
    }
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    // Email validation
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // Phone validation
    if (!isValidPhone(formData.phone)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.experience || !formData.bio || !formData.hourlyRate) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (formData.languages.length === 0) {
      toast.error("Please select at least one language");
      return false;
    }
    if (formData.destinations.length === 0) {
      toast.error("Please select at least one destination");
      return false;
    }
    if (parseFloat(formData.hourlyRate) < 100) {
      toast.error("Hourly rate must be at least ₹100");
      return false;
    }
    if (isNaN(parseFloat(formData.hourlyRate))) {
      toast.error("Please enter a valid hourly rate");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    if (!profileImage) {
      toast.error("Please upload a profile photo.");
      return;
    }
    
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => form.append(key, v));
        } else {
          form.append(key, value);
        }
      });
      form.append("profileImage", profileImage);
      const response = await fetch(`${backendUrl}/api/guide/apply`, {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Application submitted successfully! Your application is under review.");
        navigate("/guide");
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Guide</h1>
          <p className="text-gray-600">Share your expertise and help travelers discover amazing destinations</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Step {step} of 2</span>
            <span className="text-sm text-gray-500">{step === 1 ? "Personal Information" : "Professional Details"}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              /* Step 1: Personal Information */
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                <div className="flex flex-col items-center mb-6">
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo <span className="text-red-500">*</span></label>
                  <label htmlFor="profileImage" className="cursor-pointer inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                    {profileImage ? "Change Photo" : "Upload Photo"}
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                  <span className="text-xs text-gray-500 mb-2">Upload a clear, recent photo. Max size: 2MB.</span>
                  {profileImage && (
                    <span className="text-xs text-blue-700 font-medium mb-2">{profileImage.name}</span>
                  )}
                  {profileImagePreview && (
                    <img src={profileImagePreview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-lg mb-2 transition-transform duration-200 hover:scale-105" />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formData.email && !isValidEmail(formData.email) 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {formData.email && !isValidEmail(formData.email) && (
                        <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formData.phone && !isValidPhone(formData.phone) 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {formData.phone && !isValidPhone(formData.phone) && (
                        <p className="text-red-500 text-xs mt-1">Please enter a valid phone number (10-15 digits)</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded ${
                                getPasswordStrength(formData.password) >= level
                                  ? level <= 2 ? 'bg-red-500' : level <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.password.length < 6 && "At least 6 characters"}
                          {formData.password.length >= 6 && getPasswordStrength(formData.password) < 3 && "Add uppercase, numbers, or symbols"}
                          {getPasswordStrength(formData.password) >= 3 && "Good password strength"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Professional Details */
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Description *
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your experience as a guide, certifications, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate (₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        id="hourlyRate"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        required
                        min="100"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your hourly rate (₹)"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages You Speak *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {languageOptions.map((language) => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() => handleLanguageChange(language)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinations You Guide *
                  </label>
                  
                  {/* Destination Search Input */}
                  <div className="relative mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={destinationSearch}
                        onChange={(e) => handleDestinationSearch(e.target.value)}
                        placeholder="Search for destinations (e.g., Mumbai, Goa, Leh...)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Destination Suggestions Dropdown */}
                    {showDestinationDropdown && destinationSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {destinationSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => selectDestination(suggestion.description)}
                            className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 flex items-center"
                          >
                            <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-sm">{suggestion.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Destinations */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Selected Destinations ({formData.destinations.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.destinations.map((destination, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          {destination}
                          <button
                            type="button"
                            onClick={() => removeDestination(destination)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Destinations Quick Add */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Popular Destinations:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {destinationOptions.slice(0, 12).map((destination) => (
                        <button
                          key={destination}
                          type="button"
                          onClick={() => selectDestination(destination)}
                          disabled={formData.destinations.includes(destination)}
                          className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                            formData.destinations.includes(destination)
                              ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                          }`}
                        >
                          {destination}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/Introduction *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell travelers about yourself, your expertise, and what makes you a great guide..."
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Back to Guide Page */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/guide")}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to Guide Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuideRegistration; 