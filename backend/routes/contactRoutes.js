import express from 'express';
import { submitMessage, getMessages, updateMessageStatus } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitMessage)
  .get(protect, admin, getMessages);

router.put('/:id/status', protect, admin, updateMessageStatus);

export default router;
