const express = require('express');
const SessionController = require('../controllers/sessionController');
const { validateBody } = require('../middlewares/validate');
const { sessionRules } = require('../validators/resourceRules');

const router = express.Router();

router.post('/', validateBody(sessionRules), SessionController.create);

module.exports = router;
