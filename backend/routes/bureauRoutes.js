const express = require('express');
const router = express.Router();
const Bureau = require('../db/schemas/Bureau');

// Create a new bureau
router.post('/', async (req, res) => {
  try {
    const { number, level, bloc, space } = req.body;

    // Check if a bureau with the same number, level, and bloc already exists
    const existingBureau = await Bureau.findOne({ number, level, bloc });

    if (existingBureau) {
      // If a bureau with the same details exists, return an error response
      return res.status(400).json({ error: 'Bureau with the same number, level, and bloc already exists' });
    }

    // If no existing bureau found, create a new one
    const bureau = new Bureau({ number, level, bloc, space });
    await bureau.save();
    res.status(201).json(bureau);
  } catch (error) {
    console.error("Error creating bureau:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get all bureaus
router.get('/', async (req, res) => {
  try {
    const bureaus = await Bureau.find();
    res.json(bureaus);
  } catch (error) {
    console.error("Error getting bureaus:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get bureau by ID
router.get('/:id', async (req, res) => {
  try {
    const bureau = await Bureau.findById(req.params.id);
    if (!bureau) {
      return res.status(404).json({ error: 'Bureau not found' });
    }
    res.json(bureau);
  } catch (error) {
    console.error("Error getting bureau by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update bureau by ID
router.put('/:id', async (req, res) => {
  try {
    const { number, level, bloc, space } = req.body;
    const updatedBureau = await Bureau.findByIdAndUpdate(
      req.params.id,
      { number, level, bloc, space },
      { new: true }
    );
    if (!updatedBureau) {
      return res.status(404).json({ error: 'Bureau not found' });
    }
    res.json(updatedBureau);
  } catch (error) {
    console.error("Error updating bureau by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete bureau by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBureau = await Bureau.findByIdAndDelete(req.params.id);
    if (!deletedBureau) {
      return res.status(404).json({ error: 'Bureau not found' });
    }
    res.json({ message: 'Bureau deleted successfully' });
  } catch (error) {
    console.error("Error deleting bureau by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
