import Activity from '../models/Activity.js';

// @desc    Get all activities (supports location search)
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req, res) => {
  const { search } = req.query;
  try {
    let query = {};
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        $or: [
          { name: searchRegex },
          { 'location.city': searchRegex },
          { 'location.country': searchRegex },
          { 'location.state': searchRegex },
        ],
      };
    }
    const activities = await Activity.find(query);
    res.json({ success: true, count: activities.length, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single activity details
// @route   GET /api/activities/:id
// @access  Public
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (activity) {
      res.json({ success: true, activity });
    } else {
      res.status(404).json({ success: false, message: 'Activity experience not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new experience activity
// @route   POST /api/activities
// @access  Private/Admin
export const createActivity = async (req, res) => {
  const { name, description, price, duration, images, location } = req.body;

  try {
    const activity = new Activity({
      name,
      description,
      price: Number(price) || 0,
      duration: duration || '2 hours',
      images: images || ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
      location: {
        country: location?.country,
        state: location?.state,
        city: location?.city,
        postalCode: location?.postalCode,
        address: location?.address,
        coordinates: {
          lat: Number(location?.coordinates?.lat) || 0,
          lng: Number(location?.coordinates?.lng) || 0,
        },
      },
    });

    const createdActivity = await activity.save();
    res.status(201).json({ success: true, activity: createdActivity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an experience activity
// @route   PUT /api/activities/:id
// @access  Private/Admin
export const updateActivity = async (req, res) => {
  const { name, description, price, duration, images, location } = req.body;

  try {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      activity.name = name || activity.name;
      activity.description = description || activity.description;
      activity.price = price !== undefined ? Number(price) : activity.price;
      activity.duration = duration || activity.duration;
      if (images) activity.images = images;
      
      if (location) {
        activity.location = {
          country: location.country || activity.location.country,
          state: location.state || activity.location.state,
          city: location.city || activity.location.city,
          postalCode: location.postalCode || activity.location.postalCode,
          address: location.address || activity.location.address,
          coordinates: {
            lat: location.coordinates?.lat !== undefined ? Number(location.coordinates.lat) : activity.location.coordinates?.lat,
            lng: location.coordinates?.lng !== undefined ? Number(location.coordinates.lng) : activity.location.coordinates?.lng,
          },
        };
      }

      const updatedActivity = await activity.save();
      res.json({ success: true, activity: updatedActivity });
    } else {
      res.status(404).json({ success: false, message: 'Activity experience not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an experience activity
// @route   DELETE /api/activities/:id
// @access  Private/Admin
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      await activity.deleteOne();
      res.json({ success: true, message: 'Activity experience removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Activity experience not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create activity traveler review
// @route   POST /api/activities/:id/reviews
// @access  Private
export const createActivityReview = async (req, res) => {
  const { rating, reviewText } = req.body;

  try {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      const alreadyReviewed = activity.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'Activity already reviewed by you' });
      }

      const review = {
        user: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        reviewText,
      };

      activity.reviews.push(review);

      // Recalculate average rating
      const totalRating = activity.reviews.reduce((sum, r) => sum + r.rating, 0);
      activity.rating = Math.round((totalRating / activity.reviews.length) * 10) / 10;

      await activity.save();
      res.status(201).json({ success: true, message: 'Review added successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Activity experience not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
