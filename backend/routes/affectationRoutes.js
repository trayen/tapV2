const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Affectation = require('../db/schemas/Affectation');
const Bureau = require('../db/schemas/Bureau');
const Employee = require('../db/schemas/Employee');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'assets', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('decision'), async (req, res) => {
    try {
        const { employeeId, bureauId } = req.body;

        // Check if the bureau and employee exist before creating the affectation
        const existingBureau = await Bureau.findById(bureauId);
        const existingEmployee = await Employee.findById(employeeId);

        if (!existingBureau) {
            return res.status(400).json({ error: 'Bureau not found' });
        }

        if (!existingEmployee) {
            return res.status(400).json({ error: 'Employee not found' });
        }

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const affectation = new Affectation({
            employee: employeeId,
            bureau: bureauId,
            decision: path.join('uploads', req.file.filename),
        });

        await affectation.save();

        // Update the affectation field in the Employee collection
        existingEmployee.affectation = affectation;
        await existingEmployee.save();

        // Update the isAvailable field in the Bureau collection
        existingBureau.isAvailable = true;
        await existingBureau.save();

        res.status(201).json(affectation);
    } catch (error) {
        console.error('Error creating affectation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all affectations
router.get('/', async (req, res) => {
    try {
        const affectations = await Affectation.find().populate('bureau', 'numero level bloc').populate('employee', 'name matricule');
        res.json(affectations);
    } catch (error) {
        console.error("Error getting affectations:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const affectation = await Affectation.findById(req.params.id).populate('bureau', 'numero level bloc').populate('employee', 'name matricule');
        if (!affectation) {
            return res.status(404).json({ error: 'Affectation not found' });
        }
        res.json(affectation);
    } catch (error) {
        console.error("Error getting affectation by ID:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update affectation by ID
router.put('/:id', upload.single('decision'), async (req, res) => {
    try {
        const { employeeId, bureauId } = req.body;

        // Check if the bureau and employee exist before updating the affectation
        const existingBureau = bureauId ? await Bureau.findById(bureauId) : null;
        const existingEmployee = employeeId ? await Employee.findById(employeeId) : null;

        if (bureauId && !existingBureau) {
            return res.status(400).json({ error: 'Bureau not found' });
        }

        if (employeeId && !existingEmployee) {
            return res.status(400).json({ error: 'Employee not found' });
        }

        const affectationToUpdate = await Affectation.findById(req.params.id);

        if (!affectationToUpdate) {
            return res.status(404).json({ error: 'Affectation not found' });
        }

        // Delete the previous affectation from the old employee
        const oldEmployee = await Employee.findOne({ 'affectation._id': req.params.id });
        if (oldEmployee) {
            oldEmployee.affectation = null;
            await oldEmployee.save();
        }

        // Update the affectation field in the new Employee collection
        if (employeeId && affectationToUpdate.employee._id.toString() !== employeeId) {
            existingEmployee.affectation = affectationToUpdate;
            await existingEmployee.save();

            // Update the affectation with the new employee information
            affectationToUpdate.employee = existingEmployee;
        }

        // Get the old bureau before updating the affectation
        const oldBureauId = affectationToUpdate.bureau;
        const oldBureau = await Bureau.findById(oldBureauId);

        // Update the affectation in the Affectation collection
        if (bureauId && affectationToUpdate.bureau.toString() !== bureauId) {
            affectationToUpdate.bureau = bureauId;
        }

        if (req.file) {
            const filePath = path.join('uploads', req.file.filename);
            affectationToUpdate.decision = filePath;
            console.log('File Uploaded. FilePath:', filePath);
        }

        const updatedAffectation = await affectationToUpdate.save();

        // Update the isAvailable field in the old Bureau collection
        if (oldBureau) {
            const oldBureauAffectationsCount = await Affectation.countDocuments({ bureau: oldBureauId });

            if (oldBureauAffectationsCount === 0) {
                oldBureau.isAvailable = false;
                await oldBureau.save();
            }
        }

        // Update the isAvailable field in the new Bureau collection
        if (bureauId) {
            const newBureauAffectationsCount = await Affectation.countDocuments({ bureau: bureauId });

            if (newBureauAffectationsCount > 0) {
                existingBureau.isAvailable = true;
                await existingBureau.save();
            }
        }

        // Construct a sanitized version of the object without circular references
        const sanitizedAffectation = {
            _id: updatedAffectation._id,
            bureau: updatedAffectation.bureau,
            decision: updatedAffectation.decision,
            dateOfCreation: updatedAffectation.dateOfCreation,
            __v: updatedAffectation.__v,
        };

        // Send the response after the affectation is successfully updated
        res.json(sanitizedAffectation);
    } catch (error) {
        console.error('Error updating affectation by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Delete affectation by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedAffectation = await Affectation.findByIdAndDelete(req.params.id).populate('bureau', 'numero level bloc').populate('employee', 'name matricule');
        if (!deletedAffectation) {
            return res.status(404).json({ error: 'Affectation not found' });
        }

        // Update the isAvailable field in the Bureau collection
        const bureauId = deletedAffectation.bureau;
        const bureau = await Bureau.findById(bureauId);

        if (bureau) {
            const affectationsCount = await Affectation.countDocuments({ bureau: bureauId });
            if (affectationsCount === 0) {
                bureau.isAvailable = false;
                await bureau.save();
            }
        }

        res.json({ message: 'Affectation deleted successfully' });
    } catch (error) {
        console.error("Error deleting affectation by ID:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
