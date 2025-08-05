import { useState, useEffect, useContext } from "react";
import { Menuitems } from "./Menuitems";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { AppContext } from "../Context/AppContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [showGuideForm, setShowGuideForm] = useState(false); 
  const { isLoggedin, userData, logout } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("❌ Logout Error:", error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed left-1/2 transform -translate-x-1/2 flex justify-between items-center px-6 py-3 z-50 transition-all duration-300 ${
          scrolling
            ? "w-full bg-white/90 backdrop-blur-md shadow-md top-0 rounded-none"
            : "w-[95%] bg-white/80 backdrop-blur-sm top-6 rounded-xl shadow-lg"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            TravelXGuide
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {Menuitems.filter(item => item.title && item.url && item.cName).map((item, index) => (
            <Link
              key={index}
              to={item.url}
              className={`relative group transition-all duration-300 ${
                item.cName && item.cName.includes('host-tour-highlight') 
                  ? 'px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:scale-105 transform font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {item.title}
              {item.cName && !item.cName.includes('host-tour-highlight') && (
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              )}
            </Link>
          ))}

          

        
          {/* User Section */}
          {isLoggedin && userData ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                  </div>
                  
                  {/* Tour Hosting Links */}
                  
                  <Link
                    to="/my-tours"
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    onClick={() => setMenuOpen(false)}
                  >
                    📋 My Tours
                  </Link>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={logoutHandler}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg py-4 px-6"
          >
            {Menuitems.filter(item => item.title && item.url && item.cName).map((item, index) => (
              <Link
                key={index}
                to={item.url}
                className={`block py-3 border-b border-gray-100 transition-all duration-300 ${
                  item.cName && item.cName.includes('host-tour-highlight') 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}

            {/* Removed Admin Login and Become a Guide Mobile Buttons */}

            <div className="pt-4">
              {isLoggedin && userData ? (
                <>
                  <div className="flex items-center space-x-3 pb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{userData.name}</p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                  
                  {/* Tour Hosting Links for Mobile */}
                  <div className="space-y-2 pb-4">
                    <Link
                      to="/host-tour"
                      className="block w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      🏔️ Host a Tour
                    </Link>
                    <Link
                      to="/my-tours"
                      className="block w-full py-2 px-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      📋 My Tours
                    </Link>
                  </div>
                  
                  <button
                    onClick={logoutHandler}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/host-tour"
                    className="block w-full py-2 px-4 text-center border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    🏔️ Host Tour
                  </Link>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      to="/login"
                      className="py-2 px-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="py-2 px-4 text-center bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Guide Registration Popup Form */}
      {showGuideForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowGuideForm(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Become a Guide</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="Tell us about your experience..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="4"
              ></textarea>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
