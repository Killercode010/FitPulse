const express = require('express');
const PurchaseController = require('../controllers/purchaseController');
const { validateBody, validateQuery, validateId } = require('../middlewares/validate');
const { purchaseRules, userIdQueryRules, dateQueryRules } = require('../validators/resourceRules');

const router = express.Router();

router.get('/', validateQuery(userIdQueryRules), PurchaseController.getAll);
router.post('/', validateBody(purchaseRules), PurchaseController.create);
router.get('/summary', validateQuery(dateQueryRules), PurchaseController.getDailySummary);
router.get('/:id', validateId, PurchaseController.getById);

module.exports = router;
