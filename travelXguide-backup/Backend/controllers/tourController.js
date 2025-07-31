import tourModel from "../models/tourModel.js";
import userModel from "../models/userModels.js";

// Create a new tour hosting request
export const createTour = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      maxParticipants,
      startDate,
      endDate,
      category,
      difficulty,
      images = []
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!title || !description || !location || !price || !maxParticipants || !startDate || !endDate || !category || !difficulty) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start <= now) {
      return res.json({ success: false, message: "Start date must be in the future" });
    }

    if (end <= start) {
      return res.json({ success: false, message: "End date must be after start date" });
    }

    // Calculate duration automatically from dates
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Check if user exists and is verified
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.isAccountVerified) {
      return res.json({ success: false, message: "Please verify your email before hosting tours" });
    }

    // Handle uploaded location photo
    let locationPhoto = undefined;
    if (req.file) {
      locationPhoto = "/uploads/tours/" + req.file.filename;
    }

    const tour = new tourModel({
      host: userId,
      title,
      description,
      location,
      duration,
      price,
      maxParticipants,
      startDate: start,
      endDate: end,
      category,
      difficulty,
      images,
      locationPhoto,
    });

    await tour.save();

    res.json({
      success: true,
      message: "Tour hosting request submitted successfully. Waiting for admin approval.",
      tour: {
        id: tour._id,
        title: tour.title,
        location: tour.location,
        status: tour.status,
        createdAt: tour.createdAt
      }
    });

  } catch (error) {
    console.error("Tour creation error:", error);
    res.json({ success: false, message: "Failed to create tour request" });
  }
};

// Get all tours for admin approval
export const getPendingTours = async (req, res) => {
  try {
    const tours = await tourModel.find({ status: 'pending' })
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tours: tours
    });

  } catch (error) {
    console.error("Get pending tours error:", error);
    res.json({ success: false, message: "Failed to fetch pending tours" });
  }
};

// Get approved tours (public)
export const getApprovedTours = async (req, res) => {
  try {
    const tours = await tourModel.find({ status: 'approved' })
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tours: tours
    });

  } catch (error) {
    console.error("Get approved tours error:", error);
    res.json({ success: false, message: "Failed to fetch approved tours" });
  }
};

// Get all tours (admin)
export const getAllTours = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const tours = await tourModel.find(query)
      .populate('host', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await tourModel.countDocuments(query);

    res.json({
      success: true,
      tours: tours,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });

  } catch (error) {
    console.error("Get all tours error:", error);
    res.json({ success: false, message: "Failed to fetch tours" });
  }
};

// Approve or reject tour
export const updateTourStatus = async (req, res) => {
  try {
    const { tourId, status, adminNotes } = req.body;
    const adminId = req.admin.adminId; // Fixed: use req.admin instead of req.user

    if (!tourId || !status) {
      return res.json({ success: false, message: "Tour ID and status are required" });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const tour = await tourModel.findById(tourId);
    if (!tour) {
      return res.json({ success: false, message: "Tour not found" });
    }

    if (tour.status !== 'pending') {
      return res.json({ success: false, message: "Tour is not pending approval" });
    }

    tour.status = status;
    tour.adminNotes = adminNotes || '';
    
    if (status === 'approved') {
      tour.approvedBy = adminId;
      tour.approvedAt = new Date();
    }

    await tour.save();

    res.json({
      success: true,
      message: `Tour ${status} successfully`,
      tour: {
        id: tour._id,
        title: tour.title,
        status: tour.status,
        adminNotes: tour.adminNotes
      }
    });

  } catch (error) {
    console.error("Update tour status error:", error);
    res.json({ success: false, message: "Failed to update tour status" });
  }
};

// Get user's hosted tours
export const getUserTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = { host: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const tours = await tourModel.find(query)
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tours: tours
    });

  } catch (error) {
    console.error("Get user tours error:", error);
    res.json({ success: false, message: "Failed to fetch user tours" });
  }
};

// Get tour details
export const getTourDetails = async (req, res) => {
  try {
    const { tourId } = req.params;

    const tour = await tourModel.findById(tourId)
      .populate('host', 'name email')
      .populate('approvedBy', 'name');

    if (!tour) {
      return res.json({ success: false, message: "Tour not found" });
    }

    res.json({
      success: true,
      tour: tour
    });

  } catch (error) {
    console.error("Get tour details error:", error);
    res.json({ success: false, message: "Failed to fetch tour details" });
  }
};

// Update tour (only by host)
export const updateTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const tour = await tourModel.findById(tourId);
    if (!tour) {
      return res.json({ success: false, message: "Tour not found" });
    }

    if (tour.host.toString() !== userId) {
      return res.json({ success: false, message: "You can only update your own tours" });
    }

    if (tour.status !== 'pending') {
      return res.json({ success: false, message: "Can only update pending tours" });
    }

    // Remove fields that shouldn't be updated
    delete updateData.status;
    delete updateData.adminNotes;
    delete updateData.approvedBy;
    delete updateData.approvedAt;

    const updatedTour = await tourModel.findByIdAndUpdate(
      tourId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Tour updated successfully",
      tour: updatedTour
    });

  } catch (error) {
    console.error("Update tour error:", error);
    res.json({ success: false, message: "Failed to update tour" });
  }
};

// Delete tour (by host or admin)
export const deleteTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const isAdmin = !!req.admin;
    const userId = req.user?.id;

    const tour = await tourModel.findById(tourId);
    if (!tour) {
      return res.json({ success: false, message: "Tour not found" });
    }

    if (!isAdmin) {
      // User: can only delete own pending tours
      if (tour.host.toString() !== userId) {
        return res.json({ success: false, message: "You can only delete your own tours" });
      }
      if (tour.status !== 'pending') {
        return res.json({ success: false, message: "Can only delete pending tours" });
      }
    }
    // Admin: can delete any tour
    await tourModel.findByIdAndDelete(tourId);
    res.json({
      success: true,
      message: "Tour deleted successfully"
    });
  } catch (error) {
    console.error("Delete tour error:", error);
    res.json({ success: false, message: "Failed to delete tour" });
  }
}; 