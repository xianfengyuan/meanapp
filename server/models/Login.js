var mongoose = require('mongoose');

// Create the UserSchema.
var LoginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  established: {
    type: Date,
    required: false
  },
  comments: {
    type: String,
    required: false
  }
});

// Export the model.
module.exports = mongoose.model('login', LoginSchema);
