import { useState, useEffect, useContext, useRef } from "react";
import { Menuitems } from "./Menuitems";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaUser, FaChevronDown, FaPlane } from "react-icons/fa";
import { AppContext } from "../Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const { isLoggedin, userData, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("❌ Logout Error:", error);
    }
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed left-1/2 transform -translate-x-1/2 flex justify-between items-center px-4 md:px-8 py-4 z-50 transition-all duration-300 ${
          scrolling
            ? "w-full bg-white/95 backdrop-blur-lg shadow-lg top-0 rounded-none border-b border-gray-200"
            : "w-[95%] md:w-[90%] bg-white/90 backdrop-blur-md top-4 md:top-6 rounded-2xl shadow-xl border border-white/20"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
            <FaPlane className="rotate-45" />
          </div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            TravelXGuide
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {Menuitems.filter(item => item.title && item.url && item.cName).map((item, index) => (
            <Link
              key={index}
              to={item.url}
              className={`relative group px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                item.cName && item.cName.includes('host-tour-highlight')
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:scale-105 transform'
                  : isActiveLink(item.url)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {item.title}
              {item.cName && !item.cName.includes('host-tour-highlight') && isActiveLink(item.url) && (
                <motion.span
                  layoutId="navbar-indicator"
                  className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          {/* User Section */}
          {isLoggedin && userData ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-110 transition-transform">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden xl:block">
                  {userData.name}
                </span>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-teal-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-lg">
                          {userData.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{userData.name}</p>
                          <p className="text-xs text-gray-600 truncate">{userData.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <FaUser className="text-blue-600" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/host-tour"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>🏔️</span>
                        <span>Host a Tour</span>
                      </Link>
                      <Link
                        to="/my-tours"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>📋</span>
                        <span>My Tours</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed top-20 right-4 w-[calc(100%-2rem)] md:w-80 bg-white shadow-2xl rounded-2xl py-4 border border-gray-100 max-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              {Menuitems.filter(item => 
                item.title && 
                item.url && 
                item.cName && 
                !item.cName.includes('host-tour-highlight') // Exclude Host Tour from main menu
              ).map((item, index) => (
                <Link
                  key={index}
                  to={item.url}
                  className={`block py-3 px-6 border-b border-gray-100 transition-all duration-300 ${
                    isActiveLink(item.url)
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              <div className="pt-4 px-4">
                {isLoggedin && userData ? (
                  <>
                    <div className="flex items-center gap-3 pb-4 px-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold shadow-md">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{userData.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                      </div>
                    </div>

                    {/* Tour Hosting Links for Mobile */}
                    <div className="space-y-2 pb-4">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUser />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/host-tour"
                        className="flex items-center gap-2 w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>🏔️</span>
                        <span>Host a Tour</span>
                      </Link>
                      <Link
                        to="/my-tours"
                        className="flex items-center gap-2 w-full py-3 px-4 bg-green-50 hover:bg-green-100 rounded-xl text-green-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>📋</span>
                        <span>My Tours</span>
                      </Link>
                    </div>

                    <button
                      onClick={logoutHandler}
                      className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-colors font-medium"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/signup"
                      className="block w-full py-3 px-4 text-center bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
