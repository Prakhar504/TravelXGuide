import { useState, useEffect, useContext } from "react";
import daljheel from '../assetss/daljheel.jpg';
import { chatSession } from '../service/AIModal.jsx';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../Context/AppContext.jsx";
import Swal from "sweetalert2";

const API_URL = "https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json";
const API_KEY = "4690a014e7mshe970e24d2ef322fp1b5165jsn2f8db7cebf61";

export const SelectTravelList = [
  { id: 1, title: 'Just Me', desc: "A sole traveler", icon: '🙋🏾‍♀', people: '1' },
  { id: 2, title: 'A couple', desc: "Two travelers", icon: '👫🏾', people: '2' },
  { id: 3, title: 'Family', desc: "A group of fun-loving adventurers", icon: '🏡', people: '3 to 5 people' },
  { id: 4, title: 'Friends', desc: "A bunch of thrill-seekers", icon: '👩‍👩‍👦‍👦', people: '5 to 12 people' }
];

export const SelectBudgetOptions = [
  { id: 1, title: 'Affordable', desc: "Stay conscious of costs", icon: '💵' },
  { id: 2, title: 'Moderate', desc: "Keep cost on the average side", icon: '💰' },
  { id: 3, title: 'Luxury', desc: "Don't worry about cost", icon: '💎' }
];

export const AI_PROMPT = 'Generate Travel Plan for Location : {location} for {totalDays} Days for {traveler} with a {budget} budget, Give me a Hotels options list with HotelName,Hotel address,Price, hotel image url,geo coordinates,rating,descriptions and suggest itinerary with placeName,Place Details,Place Image Url, Geo Coordinates,ticket Pricing ,rating,Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.';

const steps = [
  { label: "Destination", icon: "🌍" },
  { label: "Days", icon: "📅" },
  { label: "Budget", icon: "💸" },
  { label: "Travelers", icon: "🧑‍🤝‍🧑" },
  { label: "Review", icon: "✅" }
];

function Tours() {
  const { isLoggedin, userData } = useContext(AppContext);
  const [place, setPlace] = useState("");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isLoggedin || !userData) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to access this page.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signup");
        }
      });
    }
  }, [isLoggedin, userData, navigate]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateStep = () => {
    let err = {};
    if (step === 0 && !formData.location) err.location = "Please enter a destination!";
    if (step === 1 && (!formData.noOfDays || isNaN(formData.noOfDays) || formData.noOfDays < 1 || formData.noOfDays > 5)) err.noOfDays = "Enter a valid trip duration (1-5 days)!";
    if (step === 2 && !formData.budget) err.budget = "Please select a budget!";
    if (step === 3 && !formData.traveler) err.traveler = "Please select a traveler type!";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, steps.length - 1));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const OnGenerateTrip = async () => {
    if (!validateStep()) return;
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);
    
    const toastId = toast.loading("Generating your trip plan...");
    
    // Retry configuration
    const maxRetries = 3;
    let retryCount = 0;
    
    const attemptGeneration = async () => {
      try {
        // Check if API key is available
        const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
        if (!apiKey) {
          throw new Error("Google Gemini AI API key not found. Please add VITE_GOOGLE_GEMINI_AI_API_KEY to your .env file");
        }
        
        const result = await chatSession.sendMessage(FINAL_PROMPT);
        const aiResponse = await result?.response?.text();
        
        if (!aiResponse) {
          throw new Error("No response received from AI service");
        }
        
        toast.update(toastId, {
          render: "Trip successfully generated! 🎉",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          className: 'bg-green-600 text-white'
        });
        
        navigate(`/trip-plan/${formData.location}/${formData.noOfDays}/${formData.budget}/${formData.traveler}`, {
          state: { tripData: aiResponse }
        });
        
      } catch (error) {
        console.error("Error generating trip:", error);
        
        // Handle specific error types
        let errorMessage = "Failed to generate trip plan.";
        
        if (error.message?.includes("503") || error.message?.includes("overloaded")) {
          errorMessage = "AI service is temporarily overloaded. Please try again in a few moments.";
        } else if (error.message?.includes("429")) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        } else if (error.message?.includes("401") || error.message?.includes("403")) {
          errorMessage = "API key is invalid or expired. Please check your configuration.";
        } else if (error.message?.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message?.includes("network")) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.message?.includes("API key not found")) {
          errorMessage = "Google Gemini AI API key not found. Please add VITE_GOOGLE_GEMINI_AI_API_KEY to your .env file";
        } else if (error.message?.includes("No response received")) {
          errorMessage = "AI service returned an empty response. Please try again.";
        }
        
        // Retry logic for transient errors
        if (retryCount < maxRetries && (
          error.message?.includes("503") || 
          error.message?.includes("overloaded") || 
          error.message?.includes("429") ||
          error.message?.includes("timeout")
        )) {
          retryCount++;
          const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          
          toast.update(toastId, {
            render: `AI service busy. Retrying in ${retryDelay/1000} seconds... (${retryCount}/${maxRetries})`,
            type: "warning",
            isLoading: true,
            autoClose: false
          });
          
          setTimeout(() => {
            attemptGeneration();
          }, retryDelay);
          return;
        }
        
        // Final error message
        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 8000,
          className: 'bg-red-600 text-white'
        });
        
        // Show additional help for common issues
        if (error.message?.includes("503") || error.message?.includes("overloaded")) {
          setTimeout(() => {
            toast.info("💡 Tip: Try again in 1-2 minutes when the service is less busy.", {
              autoClose: 10000
            });
          }, 2000);
        }
        
      } finally {
        if (retryCount >= maxRetries) {
          setLoading(false);
        }
      }
    };
    
    attemptGeneration();
  };

  const fetchSuggestions = async (input) => {
    if (!input) return setSuggestions([]);
    try {
      const res = await fetch(`${API_URL}?input=${encodeURIComponent(input)}&types=geocode&language=en`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "google-map-places.p.rapidapi.com"
        }
      });
      const data = await res.json();
      setSuggestions(data?.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Live summary card
  const SummaryCard = () => (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-fade-in">
      <h3 className="text-base sm:text-lg font-bold mb-2 flex items-center"><span className="mr-2">📝</span> Your Trip Summary</h3>
      <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
        <li><span className="font-semibold">Destination:</span> {formData.location || <span className="text-gray-400">Not set</span>}</li>
        <li><span className="font-semibold">Days:</span> {formData.noOfDays || <span className="text-gray-400">Not set</span>}</li>
        <li><span className="font-semibold">Budget:</span> {formData.budget || <span className="text-gray-400">Not set</span>}</li>
        <li><span className="font-semibold">Travelers:</span> {formData.traveler || <span className="text-gray-400">Not set</span>}</li>
      </ul>
      <div className="mt-3 sm:mt-4 flex justify-center">
        <img src={daljheel} alt="Preview" className="rounded-lg sm:rounded-xl w-32 sm:w-40 h-20 sm:h-24 object-cover shadow" />
      </div>
    </div>
  );

  // Stepper UI
  const Stepper = () => (
    <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
      <div className="flex items-center min-w-max">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-xl font-bold transition-all duration-300
              ${i < step ? 'bg-green-400 text-white' : i === step ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-500'}`}
              aria-current={i === step ? 'step' : undefined}
            >
              {s.icon}
            </div>
            {i < steps.length - 1 && <div className="w-6 sm:w-10 h-1 bg-gray-300 mx-1 sm:mx-2 rounded" />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12 px-3 sm:px-4 lg:px-8">
      {/* Hero Banner */}
      <div className="relative max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10 animate-slide-up">
        <img src={daljheel} alt="Travel Hero" className="w-full h-32 sm:h-40 md:h-56 object-cover rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent rounded-xl sm:rounded-2xl md:rounded-3xl flex flex-col justify-end p-3 sm:p-4 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg">Plan Your Dream Trip</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg text-blue-100">Let our AI create a personalized itinerary for you!</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
        {/* Main Form (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 animate-fade-in">
          <Stepper />
          {/* Step 1: Destination */}
          {step === 0 && (
            <div>
              <label htmlFor="destination" className="block text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-3">Where do you want to go?</label>
              <div className="relative">
                <input
                  id="destination"
                  type="text"
                  value={place}
                  placeholder="Enter destination (city, country)"
                  onChange={(e) => {
                    setPlace(e.target.value);
                    fetchSuggestions(e.target.value);
                    handleInputChange("location", e.target.value);
                  }}
                  className={`w-full pl-3 sm:pl-4 pr-4 sm:pr-5 py-3 sm:py-4 text-base sm:text-lg border rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? 'border-red-400' : 'border-gray-300'}`}
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'destination-error' : undefined}
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setPlace(s.description);
                          handleInputChange("location", s.description);
                          setSuggestions([]);
                        }}
                        className="p-3 sm:p-4 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 flex items-center text-sm sm:text-base"
                      >
                        <span className="text-blue-500 mr-2 sm:mr-3">📍</span>
                        {s.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.location && <p id="destination-error" className="text-red-500 mt-2 text-sm sm:text-base">{errors.location}</p>}
              <div className="flex justify-end mt-6 sm:mt-8">
                <button onClick={nextStep} className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all text-sm sm:text-base">Next</button>
              </div>
            </div>
          )}
          {/* Step 2: Days */}
          {step === 1 && (
            <div>
              <label htmlFor="duration" className="block text-lg font-medium text-gray-700 mb-3">How many days?</label>
              <input
                id="duration"
                type="number"
                min="1"
                max="5"
                value={formData.noOfDays || ''}
                placeholder="Number of days (1-5)"
                onChange={(e) => handleInputChange('noOfDays', parseInt(e.target.value))}
                className={`w-full pl-4 pr-5 py-4 text-lg border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.noOfDays ? 'border-red-400' : 'border-gray-300'}`}
                aria-invalid={!!errors.noOfDays}
                aria-describedby={errors.noOfDays ? 'days-error' : undefined}
              />
              {errors.noOfDays && <p id="days-error" className="text-red-500 mt-2">{errors.noOfDays}</p>}
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-all">Back</button>
                <button onClick={nextStep} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all">Next</button>
              </div>
            </div>
          )}
          {/* Step 3: Budget */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Choose your budget</h2>
              <p className="text-gray-500 mb-6">Select the budget that best fits your travel style.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {SelectBudgetOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl border-2 shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200
                      ${formData.budget === item.title
                        ? "border-blue-600 bg-gradient-to-br from-blue-100 to-blue-300 scale-105 ring-2 ring-blue-400"
                        : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"}`}
                    tabIndex={0}
                    aria-pressed={formData.budget === item.title}
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                    <span className="font-bold text-base sm:text-lg text-gray-800 mb-1">{item.title}</span>
                    <span className="text-gray-600 text-xs sm:text-sm mb-2 text-center">{item.desc}</span>
                    {formData.budget === item.title && (
                      <span className="absolute top-2 sm:top-3 right-2 sm:right-3 text-blue-600 text-xl sm:text-2xl">✔️</span>
                    )}
                  </button>
                ))}
              </div>
              {errors.budget && <p className="text-red-500 mt-2">{errors.budget}</p>}
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-all">Back</button>
                <button onClick={nextStep} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all">Next</button>
              </div>
            </div>
          )}
          {/* Step 4: Travelers */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Who's traveling?</h2>
              <p className="text-gray-500 mb-6">Let us know how many people are in your group.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {SelectTravelList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInputChange('traveler', item.people)}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl border-2 shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200
                      ${formData.traveler === item.people
                        ? "border-green-600 bg-gradient-to-br from-green-100 to-green-300 scale-105 ring-2 ring-green-400"
                        : "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50"}`}
                    tabIndex={0}
                    aria-pressed={formData.traveler === item.people}
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                    <span className="font-bold text-base sm:text-lg text-gray-800 mb-1">{item.title}</span>
                    <span className="text-gray-600 text-xs sm:text-sm mb-2 text-center">{item.desc}</span>
                    <span className="text-xs text-gray-500">{item.people}</span>
                    {formData.traveler === item.people && (
                      <span className="absolute top-2 sm:top-3 right-2 sm:right-3 text-green-600 text-xl sm:text-2xl">✔️</span>
                    )}
                  </button>
                ))}
              </div>
              {errors.traveler && <p className="text-red-500 mt-2">{errors.traveler}</p>}
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-all">Back</button>
                <button onClick={nextStep} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all">Next</button>
              </div>
            </div>
          )}
          {/* Step 5: Review & Generate */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><span className="mr-2">✅</span>Review & Generate</h2>
              <SummaryCard />
              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-all">Back</button>
                <button
                  onClick={OnGenerateTrip}
                  disabled={loading}
                  className={`px-10 py-5 rounded-xl text-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 hover:shadow-xl hover:scale-105'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate My Trip Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Live Summary Card (1/3) */}
        <div className="hidden lg:block">
          <SummaryCard />
        </div>
      </div>
      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(59,130,246,0.1); }
        }
      `}</style>
    </div>
  );
}

export default Tours;