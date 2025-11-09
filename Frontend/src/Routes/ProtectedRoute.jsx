import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import Swal from "sweetalert2";

export default function ProtectedRoute({ children }) {
  const { isLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedin) {
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
  }, [isLoggedin, navigate]);

  if (!isLoggedin) {
    // Return null instead of Navigate to prevent immediate redirect
    // The popup will handle the navigation
    return null;
  }
  
  return children;
} 