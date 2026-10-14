const express = require('express');
const UserController = require('../controllers/userController');
const { validateBody, validateId } = require('../middlewares/validate');
const { userRules } = require('../validators/resourceRules');

const router = express.Router();

router.get('/', UserController.getAll);
router.post('/', validateBody(userRules), UserController.create);
router.get('/:id', validateId, UserController.getById);
router.put('/:id', validateId, validateBody(userRules), UserController.update);
router.delete('/:id', validateId, UserController.remove);
router.get('/:id/statistics', validateId, UserController.getStatistics);

module.exports = router;
