import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    duration: {
      type: String,
      default: '2 hours',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String, // Province / State
      },
      city: {
        type: String, // District / City
        required: true,
      },
      postalCode: {
        type: String,
      },
      address: {
        type: String, // Lane / Street Address
      },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
