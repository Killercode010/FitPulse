const express = require('express');
const PersonalBestController = require('../controllers/personalBestController');
const { validateBody, validateQuery, validateId } = require('../middlewares/validate');
const {
    personalBestRules,
    personalBestUpdateRules,
    userIdQueryRules
} = require('../validators/resourceRules');

const router = express.Router();

router.get('/', validateQuery(userIdQueryRules), PersonalBestController.getAll);
router.post('/', validateBody(personalBestRules), PersonalBestController.create);
router.get('/:id', validateId, PersonalBestController.getById);
router.put('/:id', validateId, validateBody(personalBestUpdateRules), PersonalBestController.update);
router.delete('/:id', validateId, PersonalBestController.remove);

module.exports = router;
