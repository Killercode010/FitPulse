const ReviewService = require('../services/reviewService');
const createCrudController = require('./createCrudController');

module.exports = createCrudController(ReviewService);
