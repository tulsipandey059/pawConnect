const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
    required: true,
  },
  breed: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
  },
  images: [{
    type: String, // Cloudinary URL
  }],
  status: {
    type: String,
    enum: ['available', 'adopted', 'lost', 'found'],
    default: 'available',
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Pet', petSchema);

