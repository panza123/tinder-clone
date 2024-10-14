import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // For hashing and comparing passwords

// Define the User schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true // Name is required for each user
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true // Email must be unique to prevent duplicates
  },
  password: {
    type: String,
    required: true // Password is required
  },
  age: {
    type: Number,
    required: true // Age is required
  },
  gender: {
    type: String,
    required: true, // Gender is required
    enum: ['male', 'female'] // Only 'male' or 'female' is allowed as values
  },
  genderPreference: {
    type: String,
    required: true, // Gender preference is required
    enum: ['male', 'female', 'both'] // Values can be 'male', 'female', or 'both'
  },
  bio: {
    type: String,
    default: '' // Bio is optional, defaulting to an empty string if not provided
  },
  image: {
    type: String,
    default: '' // Image URL is optional, defaulting to an empty string if not provided
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds referencing other users
    ref: 'User' // Reference to the User model for liked users
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds referencing other users
    ref: 'User' // Reference to the User model for disliked users
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds referencing other users
    ref: 'User' // Reference to the User model for matched users
  }]
},{
  timestamp: true, // Automatically add createdAt and updatedAt timestamps
});

// Pre-save hook to hash the password before saving a new user or updating the password
userSchema.pre('save', async function (next) {
  // Check if the password field has been modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password using bcrypt with a salt rounds of 10
  }
  next(); // Call the next middleware or finish the operation
});

// Method to compare entered password with the hashed password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare hashed password with the entered password
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User; // Export the User model for use in other files
