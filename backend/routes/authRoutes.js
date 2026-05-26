import express from 'express';
import { registerUser, loginUser, getMe, updateProfile, getHotels, getHotelById } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);

export default router;

