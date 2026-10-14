const express = require('express');
const ClassController = require('../controllers/classController');
const { validateBody, validateQuery, validateId } = require('../middlewares/validate');
const { classRules, dateQueryRules } = require('../validators/resourceRules');

const router = express.Router();

router.get('/', validateQuery(dateQueryRules), ClassController.getAll);
router.post('/', validateBody(classRules), ClassController.create);
router.get('/:id', validateId, ClassController.getById);
router.put('/:id', validateId, validateBody(classRules), ClassController.update);
router.delete('/:id', validateId, ClassController.remove);
router.get('/:id/reviews', validateId, ClassController.getReviews);

module.exports = router;
