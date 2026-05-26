import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['traveler', 'agent', 'admin'],
      default: 'traveler',
    },
    // Agent-Specific Fields (Hotel Details)
    hotelName: {
      type: String,
    },
    location: {
      type: String,
    },
    noOfRooms: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
    },
    features: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    roomTypes: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        capacity: { type: Number, default: 2 },
        status: { type: String, enum: ['Available', 'Maintenance'], default: 'Available' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
