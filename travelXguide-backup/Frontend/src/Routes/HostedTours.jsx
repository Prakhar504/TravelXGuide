import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const HostedTours = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin } = useContext(AppContext);

  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTour, setSelectedTour] = useState(null);
  const [showTourModal, setShowTourModal] = useState(false);

  const categories = [
    "Adventure", "Cultural", "Historical", "Nature", 
    "Food", "City", "Beach", "Mountain", "Other"
  ];

  const difficulties = ["Easy", "Moderate", "Hard", "Expert"];

  useEffect(() => {
    fetchApprovedTours();
  }, []);

  const fetchApprovedTours = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/tour/approved`);

      if (response.data.success) {
        setTours(response.data.tours);
      } else {
        toast.error("Failed to fetch tours");
      }
    } catch (error) {
      console.error("Fetch tours error:", error);
      toast.error("Failed to load tours");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTourClick = (tour) => {
    setSelectedTour(tour);
    setShowTourModal(true);
  };

  const handleBookTour = (tourId) => {
    if (!isLoggedin) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to book a tour.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login / Signup",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signup");
        }
      });
      return;
    }
    // TODO: Implement booking functionality
    toast.success("Booking feature coming soon!");
  };

  const handleContactHost = (hostEmail) => {
    if (!isLoggedin) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to contact the host.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login / Signup",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signup");
        }
      });
      return;
    }
    // TODO: Implement chat/messaging functionality
    toast.success("Messaging feature coming soon!");
  };

  const filteredTours = tours.filter(tour => {
    const matchesCategory = selectedCategory === "all" || tour.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || tour.difficulty === selectedDifficulty;
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.host?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Adventure': '🏔️',
      'Cultural': '🏛️',
      'Historical': '📜',
      'Nature': '🌿',
      'Food': '🍽️',
      'City': '🏙️',
      'Beach': '🏖️',
      'Mountain': '⛰️',
      'Other': '🌟'
    };
    return icons[category] || '🌟';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-orange-100 text-orange-800',
      'Expert': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            🏔️ Discover Amazing Tours
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6">
            Explore curated tours hosted by experienced guides and passionate travelers
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4 md:mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tours, locations, or hosts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 md:px-6 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base md:text-lg"
              />
              <svg className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12 md:h-16 md:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">No tours found</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              {searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all"
                ? "Try adjusting your filters or search terms."
                : "No approved tours available at the moment. Check back soon!"
              }
            </p>
            {isLoggedin && (
              <button
                onClick={() => navigate("/host-tour")}
                className="px-4 md:px-6 py-2 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
              >
                🏔️ Host Your Own Tour
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Tour Image */}
                <div className="h-40 md:h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10">
                    <span className={`px-1 md:px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(tour.difficulty)}`}>
                      {tour.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10">
                    <span className="px-1 md:px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white">
                      {getCategoryIcon(tour.category)} {tour.category}
                    </span>
                  </div>
                  {tour.locationPhoto ? (
                    <img
                      src={tour.locationPhoto}
                      alt="Tour Location"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <svg className="h-8 w-8 md:h-12 md:w-12 text-white z-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>

                <div className="p-4 md:p-6">
                  {/* Tour Title */}
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {tour.title}
                  </h3>

                  {/* Location */}
                  <p className="text-gray-600 mb-3 flex items-center text-sm md:text-base">
                    <svg className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {tour.location}
                  </p>

                  {/* Host Info */}
                  <div className="mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium text-xs md:text-sm">
                        {tour.host?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-2 md:ml-3">
                        <p className="text-xs md:text-sm font-medium text-gray-900">{tour.host?.name}</p>
                        <p className="text-xs text-gray-500">Tour Host</p>
                      </div>
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">{tour.duration} days</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-medium">{formatPrice(tour.price)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Group:</span>
                      <p className="font-medium">{tour.maxParticipants} people</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Dates:</span>
                      <p className="font-medium">{formatDate(tour.startDate)} - {formatDate(tour.endDate)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTourClick(tour)}
                      className="flex-1 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBookTour(tour._id)}
                      className="flex-1 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

            {/* Tour Details Modal */}
      {showTourModal && selectedTour && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowTourModal(false)}
        >
          <div className="flex items-center justify-center min-h-screen p-2 md:p-4">
            <div 
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedTour.title}</h2>
                  <button
                    onClick={() => setShowTourModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tour Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(selectedTour.difficulty)}`}>
                      {selectedTour.difficulty}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      {getCategoryIcon(selectedTour.category)} {selectedTour.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium">{selectedTour.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">{selectedTour.duration} days</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-medium">{formatPrice(selectedTour.price)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Group:</span>
                      <p className="font-medium">{selectedTour.maxParticipants} people</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <p className="font-medium">{formatDate(selectedTour.startDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <p className="font-medium">{formatDate(selectedTour.endDate)}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500">Description:</span>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg text-base md:text-lg leading-relaxed text-gray-800 shadow-inner whitespace-pre-line break-words">
                      {selectedTour.description}
                    </div>
                  </div>

                  {/* Host Information */}
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">About Your Host</h3>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium text-sm md:text-base">
                        {selectedTour.host?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 md:ml-4">
                        <p className="font-medium text-gray-900 text-sm md:text-base">{selectedTour.host?.name}</p>
                        <p className="text-xs md:text-sm text-gray-500">{selectedTour.host?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 md:space-x-3 pt-4">
                    <button
                      onClick={() => handleBookTour(selectedTour._id)}
                      className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                    >
                      Book This Tour
                    </button>
                    <button
                      onClick={() => handleContactHost(selectedTour.host?.email)}
                      className="flex-1 px-4 md:px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base"
                    >
                      Contact Host
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostedTours; 