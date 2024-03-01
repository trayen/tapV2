const mongoose = require('mongoose');

const affectationSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  bureau: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bureau',
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  decision: String,

});

const Affectation = mongoose.model('Affectation', affectationSchema);

module.exports = Affectation;
