const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  googleId: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['owner', 'ngo', 'volunteer', 'admin'],
    default: 'owner',
  },
}, {
  timestamps: true,
});

// Encrypt password before save
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
