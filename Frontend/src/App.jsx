import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ⚡ PERFORMANCE: Lazy load route components for code splitting
const Home = lazy(() => import("./Routes/Home"));
const Tours = lazy(() => import("./Routes/Tours"));
const Guide = lazy(() => import("./Routes/Guide"));
const Community = lazy(() => import("./Routes/Community"));
const TripPlan = lazy(() => import("./viewTrip/Tripplan"));
const Signup = lazy(() => import("./Routes/signup"));
const AdminLogin = lazy(() => import("./Routes/AdminLogin"));
const AdminDashboard = lazy(() => import("./Routes/AdminDashboard"));
const GuideRegistration = lazy(() => import("./Routes/GuideRegistration"));
const ResetPassword = lazy(() => import("./Routes/ResetPassword"));
const UserProfile = lazy(() => import("./Routes/UserProfile"));
const HostTour = lazy(() => import("./Routes/HostTour"));
const MyTours = lazy(() => import("./Routes/MyTours"));
const AdminTourApproval = lazy(() => import("./Routes/AdminTourApproval"));
const HostedTours = lazy(() => import("./Routes/HostedTours"));
const ProtectedRoute = lazy(() => import("./Routes/ProtectedRoute"));

// ⚡ PERFORMANCE: Loading component for suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  const location = useLocation(); // ⬅️ get current URL

  // List of paths where you don't want Navbar
  const hideNavbarPaths = ["/community", "/admin/login", "/admin/dashboard", "/guide/register", "/reset-password", "/profile", "/my-tours", "/admin/tour-approval"];

  // Check if current path matches any of them
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="text-center font-poppins color-black">
      {/* Only show Navbar if hideNavbar is false */}
      {!hideNavbar && <Navbar />}

      <ToastContainer position="top-right" autoClose={3000} />

      {/* ⚡ PERFORMANCE: Wrap routes with Suspense for lazy loading */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/register" element={<GuideRegistration />} />
          <Route path="/community" element={<Community />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/host-tour" element={<ProtectedRoute><HostTour /></ProtectedRoute>} />
          <Route path="/my-tours" element={<ProtectedRoute><MyTours /></ProtectedRoute>} />
          <Route path="/hosted-tours" element={<ProtectedRoute><HostedTours /></ProtectedRoute>} />
          <Route path="/admin/tour-approval" element={<AdminTourApproval />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/trip-plan/:destination/:days/:budget/:traveler" element={<TripPlan />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
