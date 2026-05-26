import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getHotels,
  getHotelById,
  createHotelReview,
  deleteHotel,
  updateHotelByAdmin,
  getPendingHotels,
  updateHotelStatus,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);

// Hotel reviews & Admin management routes
router.post('/hotels/:id/reviews', protect, createHotelReview);
router.delete('/hotels/:id', protect, admin, deleteHotel);
router.put('/hotels/:id/admin', protect, admin, updateHotelByAdmin);

// New approvals system routes
router.get('/admin/pending-hotels', protect, admin, getPendingHotels);
router.put('/admin/hotels/:id/status', protect, admin, updateHotelStatus);

export default router;

