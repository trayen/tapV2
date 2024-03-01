const mongoose = require('mongoose');

const bureauSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  bloc: {
    type: String,
    required: true,
  },
  space: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: false, // default value is set to false
  },
});

const Bureau = mongoose.model('Bureau', bureauSchema);

module.exports = Bureau;
