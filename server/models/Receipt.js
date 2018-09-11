var mongoose = require('mongoose');

// Create the ReceiptSchema.
var ReceiptSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  payment: {
    type: Number,
    required: true
  },
  paymentType: {
    type: String,
    required: true
  }
});

// Export the model.
module.exports = mongoose.model('receipt', ReceiptSchema);
