// server/src/routes/bookingRoutes.js
import express from 'express';
import Booking from '../models/Booking.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new booking request (public endpoint)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      callType,
      preferredDate,
      preferredTime,
      timezone,
      message
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !callType || !preferredDate || !preferredTime || !timezone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate date is not in the past
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Preferred date cannot be in the past'
      });
    }

    // Create new booking
    const booking = await Booking.create({
      name,
      email,
      phone,
      company,
      callType,
      preferredDate: selectedDate,
      preferredTime,
      timezone,
      message,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      data: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        callType: booking.callType
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all bookings (admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const allBookings = await Booking.find(filter);
    const total = allBookings.length;
    
    // Sort bookings
    allBookings.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const aDate = aVal?.toDate ? aVal.toDate() : (aVal instanceof Date ? aVal : new Date(aVal));
      const bDate = bVal?.toDate ? bVal.toDate() : (bVal instanceof Date ? bVal : new Date(bVal));
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });
    
    const skip = (page - 1) * limit;
    const bookings = allBookings.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single booking by ID (admin only)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { status, adminNotes, confirmedDateTime } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (confirmedDateTime) updateData.confirmedDateTime = new Date(confirmedDateTime);

    const booking = await Booking.update(req.params.id, updateData);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete booking (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.delete(req.params.id);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
