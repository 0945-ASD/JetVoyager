import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jetvoyagersupersafesecret1234!', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (traveler or agent)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, phone, nic, role, hotelName, location, noOfRooms } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Default room types for new agents
    const defaultRoomTypes = role === 'agent' ? [
      { name: 'Single Room', price: 100, capacity: 1, status: 'Available' },
      { name: 'Double Room', price: 180, capacity: 2, status: 'Available' },
      { name: 'Suite', price: 350, capacity: 4, status: 'Available' },
    ] : [];

    const user = await User.create({
      name,
      email,
      password, // Will be hashed via pre-save hook in User schema
      phone,
      nic,
      role: role || 'traveler',
      hotelName: role === 'agent' ? hotelName : undefined,
      location: role === 'agent' ? location : undefined,
      noOfRooms: role === 'agent' ? Number(noOfRooms) || 0 : undefined,
      roomTypes: defaultRoomTypes,
      description: role === 'agent' ? 'Premium accommodation by JetVoyager partner.' : undefined,
      features: role === 'agent' ? ['Free Wi-Fi', 'Swimming Pool', 'Room Service'] : undefined,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    // Validate user, role and password
    if (user && (await user.matchPassword(password))) {
      // Check if role matches (if supplied)
      if (role && user.role !== role) {
        return res.status(400).json({ success: false, message: `Access denied. Account is registered as ${user.role}.` });
      }

      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.nic = req.body.nic || user.nic;
      user.email = req.body.email || user.email;

      // Handle agent fields
      if (user.role === 'agent') {
        user.hotelName = req.body.hotelName || user.hotelName;
        user.location = req.body.location || user.location;
        user.noOfRooms = req.body.noOfRooms !== undefined ? Number(req.body.noOfRooms) : user.noOfRooms;
        user.description = req.body.description || user.description;
        if (req.body.features) user.features = req.body.features;
        if (req.body.roomTypes) user.roomTypes = req.body.roomTypes;
      }

      // Password update if supplied
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all hotels (Agent users)
// @route   GET /api/auth/hotels
// @access  Public
export const getHotels = async (req, res) => {
  const { location } = req.query;
  try {
    let query = { role: 'agent' };
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    const hotels = await User.find(query).select('-password');
    res.json({ success: true, count: hotels.length, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single hotel details
// @route   GET /api/auth/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    const hotel = await User.findOne({ _id: req.params.id, role: 'agent' }).select('-password');
    if (hotel) {
      res.json({ success: true, hotel });
    } else {
      res.status(404).json({ success: false, message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

