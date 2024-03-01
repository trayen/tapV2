const mongoose = require('mongoose');
const Affectation = require('./Affectation');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  matricule: {
    type: String,
    unique: true,
    required: true,
  },
  emploi: {
    type: String,
  },
  affectation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affectation',
  },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
