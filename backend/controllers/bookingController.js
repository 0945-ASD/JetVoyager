import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @desc    Create a new hotel room booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { agentId, roomTypeName, checkInDate, checkOutDate, noOfRooms } = req.body;

  try {
    // 1. Fetch the hotel agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ success: false, message: 'Hotel/Agent not found' });
    }

    // 2. Find room type price
    const roomType = agent.roomTypes.find(r => r.name.toLowerCase() === roomTypeName.toLowerCase());
    if (!roomType) {
      return res.status(400).json({ success: false, message: 'Selected room type is not offered by this hotel' });
    }

    // 3. Calculate price based on check-in and check-out dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    const calculatedPrice = nights * roomType.price * (Number(noOfRooms) || 1);

    // 4. Create booking
    const booking = new Booking({
      user: req.user._id,
      agent: agentId,
      roomType: roomType.name,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      noOfRooms: Number(noOfRooms) || 1,
      totalPrice: calculatedPrice,
      status: 'pending',
    });

    const createdBooking = await booking.save();

    res.status(201).json({
      success: true,
      booking: createdBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings of the logged-in traveler
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('agent', 'name hotelName location phone email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings of the logged-in agent's hotel
// @route   GET /api/bookings/agent-bookings
// @access  Private/Agent
export const getAgentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ agent: req.user._id })
      .populate('user', 'name email phone nic')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin dashboard)
// @route   GET /api/bookings/all-bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phone')
      .populate('agent', 'hotelName location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a booking status (Confirm or Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  const { status } = req.body; // 'confirmed' or 'cancelled'

  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status update option' });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Authorization checks:
    // 1. Travelers can cancel their own bookings.
    // 2. Agents can confirm or cancel their hotel bookings.
    // 3. Admins can manage everything.
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAgentOwner = booking.agent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAgentOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to change this booking status' });
    }

    if (isOwner && status === 'confirmed' && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Travelers cannot confirm their own booking, only cancel.' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
