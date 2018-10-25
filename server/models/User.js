var mongoose = require('mongoose');

// Create the UserSchema.
var UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

// Export the model.
module.exports = mongoose.model('user', UserSchema);
