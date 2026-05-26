import Trip from '../models/Trip.js';
import User from '../models/User.js';

// @desc    Create a new collaborative trip itinerary
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
  const { title, startDate, endDate, startPoint, endDestination } = req.body;

  if (!title || !startDate || !endDate || !startPoint || !endDestination) {
    return res.status(400).json({ success: false, message: 'All general itinerary fields are required.' });
  }

  try {
    const trip = new Trip({
      title,
      creator: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startPoint,
      endDestination,
      collaborators: [],
      bookings: [],
      timeline: [
        {
          date: new Date(startDate),
          time: '08:00 AM',
          type: 'start',
          title: `Departure from starting point: ${startPoint}`,
          description: 'Official commencement of the journey.',
          completed: false,
        },
        {
          date: new Date(endDate),
          time: '08:00 PM',
          type: 'end',
          title: `Arrival at final destination: ${endDestination}`,
          description: 'Official completion of the journey.',
          completed: false,
        },
      ],
    });

    const createdTrip = await trip.save();
    res.status(201).json({ success: true, trip: createdTrip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all trips where the user is either the creator or a collaborator
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [{ creator: req.user._id }, { collaborators: req.user._id }],
    })
      .populate('creator', 'name email phone')
      .populate('collaborators', 'name email phone')
      .populate('bookings')
      .populate('timeline.activityRef')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trip details by ID
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('creator', 'name email phone')
      .populate('collaborators', 'name email')
      .populate({
        path: 'bookings',
        populate: { path: 'agent', select: 'hotelName location email phone' },
      })
      .populate('timeline.activityRef');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    // Auth check: must be creator or collaborator
    const isAuthorized =
      trip.creator.toString() === req.user._id.toString() ||
      trip.collaborators.some((collab) => collab._id.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this trip.' });
    }

    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a trip itinerary general fields
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res) => {
  const { title, startDate, endDate, startPoint, endDestination } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    const isAuthorized =
      trip.creator.toString() === req.user._id.toString() ||
      trip.collaborators.some((c) => c.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this trip.' });
    }

    trip.title = title || trip.title;
    trip.startPoint = startPoint || trip.startPoint;
    trip.endDestination = endDestination || trip.endDestination;
    if (startDate) trip.startDate = new Date(startDate);
    if (endDate) trip.endDate = new Date(endDate);

    const updatedTrip = await trip.save();
    res.json({ success: true, trip: updatedTrip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a trip itinerary
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    if (trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the trip creator can cancel the trip.' });
    }

    await trip.deleteOne();
    res.json({ success: true, message: 'Trip itinerary cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a traveler group collaborator by email
// @route   POST /api/trips/:id/collaborators
// @access  Private
export const addCollaborator = async (req, res) => {
  const { email } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    const isAuthorized =
      trip.creator.toString() === req.user._id.toString() ||
      trip.collaborators.some((c) => c.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to invite collaborators.' });
    }

    // Lookup traveler by email
    const collaborator = await User.findOne({ email, role: 'traveler' });
    if (!collaborator) {
      return res.status(404).json({ success: false, message: 'Traveler not found with this email.' });
    }

    // Verify they aren't already added
    const alreadyCollab =
      trip.creator.toString() === collaborator._id.toString() ||
      trip.collaborators.some((c) => c.toString() === collaborator._id.toString());

    if (alreadyCollab) {
      return res.status(400).json({ success: false, message: 'Traveler is already in the trip group.' });
    }

    trip.collaborators.push(collaborator._id);
    await trip.save();

    res.json({ success: true, message: `${collaborator.name} joined your travel group!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Append a custom event directly to the checklist timeline
// @route   POST /api/trips/:id/events
// @access  Private
export const addEventToTimeline = async (req, res) => {
  const { date, time, type, title, description, activityRef, bookingRef } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    const isAuthorized =
      trip.creator.toString() === req.user._id.toString() ||
      trip.collaborators.some((c) => c.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit timeline.' });
    }

    const newEvent = {
      date: new Date(date),
      time,
      type,
      title,
      description,
      completed: false,
      activityRef: activityRef || undefined,
      bookingRef: bookingRef || undefined,
    };

    // If linking a booking, append to the bookings array as well
    if (bookingRef && !trip.bookings.includes(bookingRef)) {
      trip.bookings.push(bookingRef);
    }

    trip.timeline.push(newEvent);

    // Sort timeline items chronologically
    trip.timeline.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.time.localeCompare(b.time);
    });

    await trip.save();
    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle checklist event completed state
// @route   PUT /api/trips/:id/timeline/:eventId/toggle
// @access  Private
export const toggleTimelineEvent = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    const isAuthorized =
      trip.creator.toString() === req.user._id.toString() ||
      trip.collaborators.some((c) => c.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to toggle checklist.' });
    }

    const event = trip.timeline.id(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Timeline checklist item not found.' });
    }

    event.completed = !event.completed;
    await trip.save();

    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove an event from the timeline
// @route   DELETE /api/trips/:id/timeline/:eventId
// @access  Private
export const removeTimelineEvent = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    const isAuthorized =
      trip.creator.toString() === req.user._id.toString() ||
      trip.collaborators.some((c) => c.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit timeline.' });
    }

    const event = trip.timeline.id(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Timeline item not found.' });
    }

    // Pull from timeline array
    trip.timeline.pull(req.params.eventId);
    await trip.save();

    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
