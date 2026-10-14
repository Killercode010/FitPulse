const express = require('express');
const InstructorController = require('../controllers/instructorController');
const { validateBody, validateId } = require('../middlewares/validate');
const { instructorRules } = require('../validators/resourceRules');

const router = express.Router();

router.get('/', InstructorController.getAll);
router.post('/', validateBody(instructorRules), InstructorController.create);
router.get('/:id', validateId, InstructorController.getById);
router.put('/:id', validateId, validateBody(instructorRules), InstructorController.update);
router.delete('/:id', validateId, InstructorController.remove);

module.exports = router;
