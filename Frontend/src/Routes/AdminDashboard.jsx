import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  LogOut,
  Eye,
  Check,
  X,
  Search,
  Filter,
  UserMinus,
  UserPlus
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    
    fetchDashboardData();
  }, [currentPage, selectedStatus]);

  const fetchDashboardData = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      
      // Fetch stats
      const statsResponse = await fetch(`${backendUrl}/api/admin/dashboard/stats`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch applications
      const applicationsResponse = await fetch(
        `${backendUrl}/api/admin/applications?status=${selectedStatus}&page=${currentPage}&limit=10`, 
        {
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        }
      );
      const applicationsData = await applicationsResponse.json();
      
      if (applicationsData.success) {
        setApplications(applicationsData.applications);
        setPagination(applicationsData.pagination);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const handleViewApplication = async (applicationId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${backendUrl}/api/admin/applications/${applicationId}`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSelectedApplication(data.application);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast.error("Failed to load application details");
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${backendUrl}/api/admin/applications/${selectedApplication._id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ adminNotes })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Application approved successfully!");
        setShowModal(false);
        setSelectedApplication(null);
        setAdminNotes("");
        fetchDashboardData();
      } else {
        toast.error(data.message || "Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${backendUrl}/api/admin/applications/${selectedApplication._id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ adminNotes })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Application rejected");
        setShowModal(false);
        setSelectedApplication(null);
        setAdminNotes("");
        fetchDashboardData();
      } else {
        toast.error(data.message || "Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (guideId, currentStatus) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${backendUrl}/api/admin/guides/${guideId}/active`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchDashboardData();
      } else {
        toast.error(data.message || "Failed to update guide status");
      }
    } catch (error) {
      console.error("Error updating guide status:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage guide applications and tours</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation Menu */}
              <nav className="flex space-x-4">
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
                >
                  Guide Applications
                </button>
                <button
                  onClick={() => navigate("/admin/tour-approval")}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 font-medium"
                >
                  Tour Management
                </button>
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-900">Guide Applications</h2>
              
              {/* Filters */}
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guide
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        <div className="text-sm text-gray-500">{application.languages.join(", ")}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{application.email}</div>
                        <div className="text-sm text-gray-500">{application.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{application.hourlyRate}/hr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewApplication(application._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {application.status === "approved" && (
                        <button
                          onClick={() => handleToggleActive(application._id, application.isActive)}
                          className={`ml-2 px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center
                            ${application.isActive ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                        >
                          {application.isActive ? <UserMinus className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
                          {application.isActive ? "Unlist" : "List"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedApplication.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedApplication.phone}</p>
                    <p><span className="font-medium">Experience:</span> {selectedApplication.experience}</p>
                    <p><span className="font-medium">Hourly Rate:</span> ₹{selectedApplication.hourlyRate}/hr</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Languages:</span> {selectedApplication.languages.join(", ")}</p>
                    <p><span className="font-medium">Destinations:</span> {selectedApplication.destinations.join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-sm text-gray-600">{selectedApplication.bio}</p>
              </div>

              {selectedApplication.status === "pending" && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Admin Notes (Optional)</h4>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Add notes about this application..."
                  />
                </div>
              )}

              {selectedApplication.adminNotes && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Previous Admin Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {selectedApplication.adminNotes}
                  </p>
                </div>
              )}
            </div>

            {selectedApplication.status === "pending" && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Rejecting..." : "Reject"}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? "Approving..." : "Approve"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 