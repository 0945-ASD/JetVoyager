import Destination from '../models/Destination.js';

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (destination) {
      res.json({ success: true, destination });
    } else {
      res.status(404).json({ success: false, message: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req, res) => {
  const { name, location, description, images } = req.body;

  try {
    const destination = new Destination({
      name,
      location,
      description,
      images: images || ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
    });

    const createdDestination = await destination.save();
    res.status(201).json({ success: true, destination: createdDestination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req, res) => {
  const { name, location, description, images } = req.body;

  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      destination.name = name || destination.name;
      destination.location = location || destination.location;
      destination.description = description || destination.description;
      if (images) destination.images = images;

      const updatedDestination = await destination.save();
      res.json({ success: true, destination: updatedDestination });
    } else {
      res.status(404).json({ success: false, message: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      await destination.deleteOne();
      res.json({ success: true, message: 'Destination removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create destination review
// @route   POST /api/destinations/:id/reviews
// @access  Private
export const createDestinationReview = async (req, res) => {
  const { rating, reviewText } = req.body;

  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      // Check if user already reviewed
      const alreadyReviewed = destination.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'Destination already reviewed by you' });
      }

      const review = {
        user: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        reviewText,
      };

      destination.reviews.push(review);
      await destination.save();

      res.status(201).json({ success: true, message: 'Review added successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
