const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../db/schemas/Employee');
const Bureau = require('../db/schemas/Bureau');
const Affectation = require('../db/schemas/Affectation');

// Route to get employees with affectation
router.get('/employees/with-affectation', async (req, res) => {
  try {
    const allAffectations = await Affectation.find();
    const employeeIdsWithAffectation = allAffectations.map(affectation => affectation.employee);
    const employeesWithAffectation = await Employee.find({ _id: { $in: employeeIdsWithAffectation } });

    res.json(employeesWithAffectation);
  } catch (error) {
    console.error("Error getting employees with affectation:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get employees without affectation
router.get('/employees/without-affectation', async (req, res) => {
  try {
    const allAffectations = await Affectation.find();
    const employeeIdsWithAffectation = allAffectations.map(affectation => affectation.employee);
    const employeesWithoutAffectation = await Employee.find({ _id: { $nin: employeeIdsWithAffectation } });

    res.json(employeesWithoutAffectation);
  } catch (error) {
    console.error("Error getting employees without affectation:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get bureaus with affectation
router.get('/bureaus/with-affectation', async (req, res) => {
  try {
    const allAffectations = await Affectation.find();
    const bureauIdsInAffectation = allAffectations.map(affectation => affectation.bureau);
    const bureausWithAffectation = await Bureau.find({ _id: { $in: bureauIdsInAffectation } });

    res.json(bureausWithAffectation);
  } catch (error) {
    console.error("Error getting bureaus with affectation:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get bureaus without affectation
router.get('/bureaus/without-affectation', async (req, res) => {
  try {
    const allAffectations = await Affectation.find();
    const bureauIdsInAffectation = allAffectations.map(affectation => affectation.bureau);
    const bureausWithoutAffectation = await Bureau.find({ _id: { $nin: bureauIdsInAffectation } });

    res.json(bureausWithoutAffectation);
  } catch (error) {
    console.error("Error getting bureaus without affectation:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
