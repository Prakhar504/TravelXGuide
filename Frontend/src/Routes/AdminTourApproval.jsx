import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AdminTourApproval = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }
    
    fetchTours();
  }, [statusFilter]);

  const fetchTours = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      
      if (!adminToken) {
        toast.error("Please login as admin");
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${backendUrl}/api/tour/all?status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      if (response.data.success) {
        setTours(response.data.tours);
      } else {
        toast.error(response.data.message || "Failed to fetch tours");
      }
    } catch (error) {
      console.error("Fetch tours error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login as admin");
        navigate("/admin/login");
      } else {
        toast.error("Failed to fetch tours");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReject = (tour, action) => {
    setSelectedTour(tour);
    setAdminNotes("");
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedTour) return;

    setIsProcessing(true);

    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        toast.error("Please login as admin");
        navigate("/admin/login");
        return;
      }

      const response = await axios.put(`${backendUrl}/api/tour/approve`, {
        tourId: selectedTour._id,
        status: selectedTour.status === 'pending' ? 'approved' : 'rejected',
        adminNotes: adminNotes
      }, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      if (response.data.success) {
        toast.success(`Tour ${selectedTour.status === 'pending' ? 'approved' : 'rejected'} successfully`);
        setShowModal(false);
        setSelectedTour(null);
        setAdminNotes("");
        fetchTours();
      } else {
        toast.error(response.data.message || "Failed to update tour status");
      }
    } catch (error) {
      console.error("Update tour status error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login as admin");
        navigate("/admin/login");
      } else {
        toast.error("Failed to update tour status");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending Approval" },
      approved: { color: "bg-green-100 text-green-800", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
      cancelled: { color: "bg-gray-100 text-gray-800", text: "Cancelled" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
              <p className="text-gray-600 mt-2">Review and manage tour hosting requests</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Navigation Menu */}
              <nav className="flex space-x-4">
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 font-medium"
                >
                  Guide Applications
                </button>
                <button
                  onClick={() => navigate("/admin/tour-approval")}
                  className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
                >
                  Tour Management
                </button>
              </nav>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved Tours</option>
                <option value="rejected">Rejected Tours</option>
                <option value="all">All Tours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tours List */}
        {tours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-600">
              {statusFilter === "pending" 
                ? "No pending tour requests at the moment." 
                : `No ${statusFilter} tours found.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Tour Image Placeholder */}
                <div className="h-40 md:h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
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

                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-3">
                    {getStatusBadge(tour.status)}
                    <span className="text-sm text-gray-500">
                      {formatDate(tour.createdAt)}
                    </span>
                  </div>

                  {/* Tour Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tour.title}
                  </h3>

                  {/* Host Info */}
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Host:</span> {tour.host?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {tour.host?.email}
                    </p>
                  </div>

                  {/* Location */}
                  <p className="text-gray-600 mb-3 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {tour.location}
                  </p>

                  {/* Tour Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">{tour.duration} days</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-medium">{formatPrice(tour.price)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="font-medium">{tour.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulty:</span>
                      <p className="font-medium">{tour.difficulty}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start:</span>
                      <span className="font-medium">{formatDate(tour.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">End:</span>
                      <span className="font-medium">{formatDate(tour.endDate)}</span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {tour.description}
                    </p>
                  </div>

                  {/* Admin Notes */}
                  {tour.adminNotes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Admin Note:</span> {tour.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {tour.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveReject(tour, 'approve')}
                        className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveReject(tour, 'reject')}
                        className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {/* Action Buttons for Admin */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this tour?')) {
                          try {
                            const adminToken = localStorage.getItem('adminToken');
                            const response = await axios.delete(`${backendUrl}/api/tour/admin-delete/${tour._id}`, {
                              headers: { Authorization: `Bearer ${adminToken}` }
                            });
                            if (response.data.success) {
                              toast.success('Tour deleted successfully');
                              fetchTours();
                            } else {
                              toast.error(response.data.message || 'Failed to delete tour');
                            }
                          } catch (error) {
                            toast.error('Failed to delete tour');
                          }
                        }
                      }}
                      className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showModal && selectedTour && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedTour.status === 'pending' ? 'Approve' : 'Reject'} Tour
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Tour:</span> {selectedTour.title}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Host:</span> {selectedTour.host?.name}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add any notes for the host..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 ${
                  selectedTour.status === 'pending' 
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                } disabled:opacity-50`}
              >
                {isProcessing ? "Processing..." : (selectedTour.status === 'pending' ? "Approve" : "Reject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTourApproval; 