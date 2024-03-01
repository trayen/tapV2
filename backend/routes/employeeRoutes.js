const express = require('express');
const router = express.Router();
const Employee = require('../db/schemas/Employee');

// Create a new employee
router.post('/',async (req, res) => {
  try {
    const { name, matricule, emploi, affectation } = req.body;
    const employee = new Employee({ name, matricule, emploi, affectation });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error("Error getting employees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error("Error getting employee by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update employee by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, matricule, emploi, affectation } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, matricule, emploi, affectation },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error("Error deleting employee by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
