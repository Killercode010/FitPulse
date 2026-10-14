const express = require('express');
const ReviewController = require('../controllers/reviewController');
const { validateBody, validateQuery, validateId } = require('../middlewares/validate');
const { reviewRules, reviewUpdateRules, reviewQueryRules } = require('../validators/resourceRules');

const router = express.Router();

router.get('/', validateQuery(reviewQueryRules), ReviewController.getAll);
router.post('/', validateBody(reviewRules), ReviewController.create);
router.get('/:id', validateId, ReviewController.getById);
router.put('/:id', validateId, validateBody(reviewUpdateRules), ReviewController.update);
router.delete('/:id', validateId, ReviewController.remove);

module.exports = router;
