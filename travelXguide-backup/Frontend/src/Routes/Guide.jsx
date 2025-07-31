import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Star, MapPin, Languages, Clock, IndianRupee, User, Plus, Search } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GuideCard from "../components/GuideCard";
import Swal from "sweetalert2";


function Guide() {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All Destinations");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [priceRange, setPriceRange] = useState([500, 2500]);
  const [experienceRange, setExperienceRange] = useState([1, 10]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { backendUrl, isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();

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

  // Get unique destinations and languages from guides
  const allDestinations = [...new Set(guides.flatMap(guide => guide.destinations))].sort();
  const allLanguages = [...new Set(guides.flatMap(guide => guide.languages))].sort();

  useEffect(() => {
    fetchApprovedGuides();
  }, []);

  const fetchApprovedGuides = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/guide/approved`);
      const data = await response.json();
      
      if (data.success) {
        setGuides(data.guides);
        setFilteredGuides(data.guides);
      } else {
        toast.error("Failed to load guides");
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = guides.filter((guide) => {
      const matchesLocation =
        selectedLocation === "All Destinations" ||
        guide.destinations.includes(selectedLocation);
      const matchesLanguage =
        selectedLanguage === "All Languages" ||
        guide.languages.includes(selectedLanguage);
      const matchesPrice = 
        guide.hourlyRate >= priceRange[0] && guide.hourlyRate <= priceRange[1];
      const matchesSearch = 
        !searchTerm || 
        guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.bio.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLocation && matchesLanguage && matchesPrice && matchesSearch;
    });
    setFilteredGuides(filtered);
    setShowFilters(false);
  };

  const handleClear = () => {
    setSelectedLocation("All Destinations");
    setSelectedLanguage("All Languages");
    setPriceRange([500, 2500]);
    setSearchTerm("");
    setFilteredGuides(guides);
    setShowFilters(false);
  };

  const openGuideDetails = (guide) => setSelectedGuide(guide);
  const closeGuideDetails = () => setSelectedGuide(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-56 md:h-96 overflow-hidden">
        <img 
          src="/01.jpg" 
          alt="Tour Guides" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-center justify-end pb-8 md:pb-16 px-2 md:px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-2 md:mb-4">
            Discover Expert Tour Guides
          </h1>
          <p className="text-base md:text-lg text-gray-200 text-center max-w-lg md:max-w-2xl">
            Connect with certified local guides who will bring your travel experience to life
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 md:py-12">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search guides by name or expertise..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Destinations</option>
                {allDestinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Languages</option>
                {allLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="self-end md:self-auto px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'More Filters'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="500"
                  max="2500"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="500"
                  max="2500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience: {experienceRange[0]} - {experienceRange[1]} years
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={experienceRange[0]}
                  onChange={(e) => setExperienceRange([parseInt(e.target.value), experienceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={experienceRange[1]}
                  onChange={(e) => setExperienceRange([experienceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              onClick={() => navigate("/guide/register")}
              className="flex items-center px-6 py-3 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Become a Guide
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Search Guides
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading guides...</p>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredGuides.length} {filteredGuides.length === 1 ? 'Guide' : 'Guides'} Available
              </h2>
              <div className="text-gray-500">
                Sorted by: <span className="font-medium text-gray-700">Rating (Highest First)</span>
              </div>
            </div>

            {filteredGuides.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No guides match your search</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find the perfect guide</p>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} onKnowMore={openGuideDetails} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Guide Details Modal */}
      <Dialog.Root open={!!selectedGuide} onOpenChange={closeGuideDetails}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            {selectedGuide && (
              <>
                <div className="flex justify-end">
                  <Dialog.Close className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md">
                    <X className="w-5 h-5 text-gray-700" />
                  </Dialog.Close>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-gray-900">
                        {selectedGuide.name}
                      </Dialog.Title>
                      <p className="text-gray-600">Certified Guide</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{selectedGuide.rating || "New"}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">{selectedGuide.bio}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Specializes in</div>
                              <div className="font-medium">{selectedGuide.destinations.join(", ")}</div>
                            </div>
                          </div>
                          {/* Email */}
                          {selectedGuide.email && (
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-4 4H8a4 4 0 01-4-4v-1" /></svg>
                              <div>
                                <div className="text-sm text-gray-500">Email</div>
                                <div className="font-medium">{selectedGuide.email}</div>
                              </div>
                            </div>
                          )}
                          {/* Phone */}
                          {selectedGuide.phone && (
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                              <div>
                                <div className="text-sm text-gray-500">Phone</div>
                                <div className="font-medium">{selectedGuide.phone}</div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Languages className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Languages</div>
                              <div className="font-medium">{selectedGuide.languages.join(", ")}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Experience</div>
                              <div className="font-medium">{selectedGuide.experience}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <IndianRupee className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Hourly Rate</div>
                              <div className="font-medium">₹{selectedGuide.hourlyRate}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div 
                          key={day} 
                          className={`px-3 py-1.5 rounded-full text-sm ${Math.random() > 0.3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Save for Later
                      </button>
                      <button className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-md">
                        Book This Guide
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default Guide;