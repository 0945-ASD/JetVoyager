import express from 'express';
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  createActivityReview,
} from '../controllers/activityController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getActivities)
  .post(protect, admin, createActivity);

router.route('/:id')
  .get(getActivityById)
  .put(protect, admin, updateActivity)
  .delete(protect, admin, deleteActivity);

router.post('/:id/reviews', protect, createActivityReview);

export default router;
