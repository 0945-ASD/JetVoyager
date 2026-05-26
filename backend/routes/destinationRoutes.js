import express from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  createDestinationReview,
} from '../controllers/destinationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDestinations)
  .post(protect, admin, createDestination);

router.route('/:id')
  .get(getDestinationById)
  .put(protect, admin, updateDestination)
  .delete(protect, admin, deleteDestination);

router.post('/:id/reviews', protect, createDestinationReview);

export default router;
