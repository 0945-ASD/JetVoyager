import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Model Imports for Stats API
import User from './models/User.js';
import Destination from './models/Destination.js';
import Booking from './models/Booking.js';
import { protect, admin } from './middleware/authMiddleware.js';

// Initialize Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Root Route
app.get('/', (req, res) => {
  res.send('JetVoyager API is running successfully...');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

// @desc    Get dashboard metrics for Admin Panel
// @route   GET /api/admin/stats
// @access  Private/Admin
app.get('/api/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'traveler' });
    const totalHotels = await User.countDocuments({ role: 'agent' });
    const totalDestinations = await Destination.countDocuments({});
    const totalBookings = await Booking.countDocuments({});

    // Calculate total revenue from confirmed bookings
    const confirmedBookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalHotels,
        totalDestinations,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
