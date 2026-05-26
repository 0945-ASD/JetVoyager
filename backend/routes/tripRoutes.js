import express from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addCollaborator,
  addEventToTimeline,
  toggleTimelineEvent,
  removeTimelineEvent,
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTrip)
  .get(getTrips);

router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

router.post('/:id/collaborators', addCollaborator);
router.post('/:id/events', addEventToTimeline);
router.put('/:id/timeline/:eventId/toggle', toggleTimelineEvent);
router.delete('/:id/timeline/:eventId', removeTimelineEvent);

export default router;
