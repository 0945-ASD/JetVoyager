import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAgentBookings,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, admin, agent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/agent-bookings', protect, protect, agent, getAgentBookings);
router.get('/all-bookings', protect, protect, admin, getAllBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
