const PersonalBestService = require('../services/personalBestService');
const createCrudController = require('./createCrudController');

module.exports = createCrudController(PersonalBestService);
